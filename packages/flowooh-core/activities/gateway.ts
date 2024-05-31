import { Activity, GoOutInterface, Sequence } from '@flowooh/core/base';
import { Status, Token } from '@flowooh/core/context';
import { $, BPMNGateway, BPMNProcess, BPMNSequenceFlow, IdentityOptions } from '@flowooh/core/types';
import { getWrappedBPMNElement, logger, takeOutgoing } from '@flowooh/core/utils';

const log = logger('gateway');

export enum GatewayType {
  /** execute multiple branches in parallel or merge multiple branches in the process flow */
  Parallel = 'parallel',
  /** allowing MULTIPLE outgoing paths to be executed based on the conditions */
  Inclusive = 'inclusive',
  /** XOR gateway, allowing ONLY ONE outgoing path to be selected */
  Exclusive = 'exclusive',
  /** Allowing for exclusive choices based on multiple conditions */
  Complex = 'complex',
  /** Used to execute different paths in the process flow based on triggered events, similar to event-driven processes */
  EventBased = 'eventBased',
}

export class GatewayActivity extends Activity {
  declare $: $<{ default?: string }>['$'];

  constructor(process: BPMNProcess, data?: Partial<GatewayActivity>, key?: string) {
    super(process, data, key);
  }

  protected takeGatewayOutgoing(identity?: IdentityOptions) {
    let outgoing: Activity[] | undefined = takeOutgoing(this.outgoing, identity);

    switch (this.type) {
      case GatewayType.Complex: {
        break;
      }
      case GatewayType.Parallel: {
        if (this.context && this.token) {
          const tokens = this.context.getTokens({ id: this.id });

          if (tokens?.length !== this.incoming?.length) {
            // if there are multiple incoming flows, and the number of tokens is not equal to the number of incoming flows,
            // it means that the gateway has not received ALL the tokens from the incoming flows
            // so we pause the gateway, and wait for the rest of the tokens
            this.token.pause();
            return;
          } else if (this.incoming.length > 1) {
            // if there are multiple incoming flows, it should terminate all the incoming tokens, and create a new token
            // when there is only one incoming path, it has no confusion, and the token can be passed directly
            // but when there are multiple incoming paths, it cannot specify which token to pass to the outgoing path
            // so it is necessary to terminate all the incoming tokens
            tokens.forEach((t) => {
              t.locked = true;
              t.status = Status.Terminated;
            });

            this.token = Token.build({ history: [this.token.state.clone()] });
            this.context.addToken(this.token);
          }

          outgoing = outgoing ?? takeOutgoing(this.outgoing);
        }
        break;
      }

      case GatewayType.Inclusive: {
        const matchedSequences = this.outgoing?.filter((out) => out.condition(this.context?.data));
        if (matchedSequences.length >= 1) {
          outgoing = takeOutgoing(matchedSequences);
        } else {
          outgoing = this.default ? takeOutgoing([this.default]) : undefined;
        }
        break;
      }

      case GatewayType.Exclusive: {
        const matchedSequences = this.outgoing?.filter((out) => out.condition(this.context?.data));
        if (matchedSequences.length > 1) {
          log.warn(`Multiple outgoing paths were matched for the gateway ${this.id}: ${matchedSequences.map((out) => out.id)}`);
          if (matchedSequences.some((s) => s.id === this.default?.id)) {
            outgoing = this.default ? takeOutgoing([this.default]) : undefined;
          } else {
            outgoing = takeOutgoing([matchedSequences[0]]);
          }
        } else if (matchedSequences.length === 1) {
          outgoing = takeOutgoing(matchedSequences);
        } else {
          outgoing = this.default ? takeOutgoing([this.default]) : undefined;
        }
        break;
      }
      case GatewayType.EventBased: {
        break;
      }
    }

    return outgoing;
  }

  /**
   * rewrite {@link Activity#takeOutgoing}
   */
  takeOutgoing(options: { identity?: IdentityOptions; pause?: boolean | string }) {
    if (!this.outgoing || !this.outgoing?.length) return;

    const outgoing = this.takeGatewayOutgoing(options?.identity);

    if (!outgoing) return;

    this.goOut(outgoing.map((out) => ({ activity: out, pause: options?.pause })));
  }

  /**
   * rewrite {@link Activity#takeOutgoings}
   */
  takeOutgoings(options: { identity?: IdentityOptions; pause?: boolean | string }[]) {
    if (!this.outgoing || !this.outgoing?.length) return;

    const outgoing: { [id: string]: GoOutInterface } = {};

    for (const option of options) {
      const { identity, pause } = option;
      const activity = this.takeGatewayOutgoing(identity)?.pop();

      if (activity) outgoing[activity.id] = { activity, pause };
    }

    this.goOut(Object.values(outgoing));
  }

  get default(): Sequence | undefined {
    if (this.type === GatewayType.Parallel) return;
    if (this.type === GatewayType.EventBased) return;
    if (this.type === GatewayType.Complex) return;

    if (!this.$.default) return;
    const flow = getWrappedBPMNElement<BPMNSequenceFlow>(this.process, { id: this.$.default })?.element;
    if (!flow) {
      log.error(`Default sequence flow ${this.$.default} of gateway ${this.id} not found.`);
      return;
    }
    const sequence = Sequence.build(this.process, flow);
    if (sequence.conditionExpression) {
      log.warn(`Default sequence flow ${sequence.id} of gateway ${this.id} has a condition expression, which is not allowed.`);
    }
    return sequence;
  }

  get type() {
    if (this.key?.toLowerCase()?.includes('complex')) return GatewayType.Complex;
    if (this.key?.toLowerCase()?.includes('parallel')) return GatewayType.Parallel;
    if (this.key?.toLowerCase()?.includes('inclusive')) return GatewayType.Inclusive;
    if (this.key?.toLowerCase()?.includes('exclusive')) return GatewayType.Exclusive;
    if (this.key?.toLowerCase()?.includes('eventBased')) return GatewayType.EventBased;
  }

  static build(el: BPMNGateway, process: BPMNProcess, key?: string) {
    return new GatewayActivity(process, { ...el }, key);
  }
}
