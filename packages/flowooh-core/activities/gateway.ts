import { Activity, GoOutInterface, Sequence } from '@flowooh/core/base';
import { Status, Token } from '@flowooh/core/context';
import { $, BPMNGateway, BPMNProcess, BPMNSequenceFlow, IdentityOptions } from '@flowooh/core/types';
import { getActivity, getWrappedBPMNElement, logger, takeOutgoing } from '@flowooh/core/utils';

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

    if (!this.context) {
      throw new Error('Context is missing');
    }
    if (!this.token) {
      throw new Error('Token is missing');
    }

    // get all the tokens that are currently in the gateway
    const tokens = this.context.getTokens({ id: this.id });

    switch (this.type) {
      case GatewayType.Complex: {
        break;
      }
      case GatewayType.Parallel: {
        if (tokens?.length !== this.incoming?.length) {
          // if there are multiple incoming flows, and the number of tokens is not equal to the number of incoming flows,
          // it means that the gateway has not received ALL the tokens from the incoming flows
          // so we pause the gateway, and wait for the rest of the tokens
          log.debug(`Waiting for all incoming tokens in Parallel Gateway ${this.name}(${this.id})`);
          this.token.pause();
          return;
        }

        if (this.incoming.length > 1) {
          // if there are multiple incoming flows, it should terminate all the incoming tokens, and create a new token
          // when there is only one incoming path, it has no confusion, and the token can be passed directly
          // but when there are multiple incoming paths, it cannot specify which token to pass to the outgoing path
          // so it is necessary to terminate all the incoming tokens
          tokens.forEach((t) => {
            t.lock();
            t.status = Status.Terminated;
          });

          this.token = Token.build({ history: [this.token.state.clone()] });
          this.context.addToken(this.token);
        }

        // all the outgoing paths should be executed
        const matchedSequences = this.outgoing;
        outgoing = takeOutgoing(matchedSequences);
        break;
      }

      case GatewayType.Inclusive: {
        const actIds = this.context.tokens.filter((t) => t.status !== Status.Completed && t.status !== Status.Terminated).map((t) => t.state.ref);
        const acts = actIds.map((actId) => getActivity(this.process, getWrappedBPMNElement(this.process, { id: actId })));
        if (!tokens?.length || acts.some((act) => act.downStreamActivities?.some((a) => a.id === this.id))) {
          // if there are multiple incoming flows, and the number of tokens is not equal to the number of incoming flows,
          // it means that the gateway has not received ALL the tokens from the incoming flows
          // so we pause the gateway, and wait for the rest of the tokens
          log.debug(`Waiting for all incoming tokens in Exclusive Gateway ${this.name}(${this.id})`);
          this.token.pause();
          return;
        }

        // execute the outgoing path that meets the condition
        const matchedSequences = this.outgoing?.filter((out) => {
          const r = out.condition(this.context?.data);
          log.info(`Condition Result of ${out.id} in Inclusive Gateway ${this.name}(${this.id}): ${r}`);
          return r;
        });

        if (matchedSequences.length > 1) {
          // if there are multiple incoming flows, it should terminate all the incoming tokens, and create a new token
          // when there is only one incoming path, it has no confusion, and the token can be passed directly
          // but when there are multiple incoming paths, it cannot specify which token to pass to the outgoing path
          // so it is necessary to terminate all the incoming tokens
          tokens.forEach((t) => {
            t.lock();
            t.status = Status.Terminated;
          });

          this.token = Token.build({ history: [this.token.state.clone()] });
          this.context.addToken(this.token);
        }

        // if there are multiple outgoing paths that meet the condition, all the outgoing paths should be executed
        if (matchedSequences.length >= 1) {
          outgoing = takeOutgoing(matchedSequences);
        } else {
          outgoing = this.default ? takeOutgoing([this.default]) : undefined;
        }
        break;
      }

      case GatewayType.Exclusive: {
        const actIds = this.context.tokens.filter((t) => t.status !== Status.Completed && t.status !== Status.Terminated).map((t) => t.state.ref);
        const acts = actIds.map((actId) => getActivity(this.process, getWrappedBPMNElement(this.process, { id: actId })));
        if (!tokens?.length || acts.some((act) => act.downStreamActivities?.some((a) => a.id === this.id))) {
          // if there are multiple incoming flows, and the number of tokens is not equal to the number of incoming flows,
          // it means that the gateway has not received ALL the tokens from the incoming flows
          // so we pause the gateway, and wait for the rest of the tokens
          log.debug(`Waiting for all incoming tokens in Exclusive Gateway ${this.name}(${this.id})`);
          this.token.pause();
          return;
        }

        // execute the outgoing path that meets the condition
        const matchedSequences = this.outgoing?.filter((out) => {
          const r = out.condition(this.context?.data);
          log.info(`Condition Result of ${out.id} in Exclusive Gateway ${this.name}(${this.id}): ${r}`);
          return r;
        });

        if (matchedSequences.length > 1) {
          // if there are multiple incoming flows, it should terminate all the incoming tokens, and create a new token
          // when there is only one incoming path, it has no confusion, and the token can be passed directly
          // but when there are multiple incoming paths, it cannot specify which token to pass to the outgoing path
          // so it is necessary to terminate all the incoming tokens
          tokens.forEach((t) => {
            t.lock();
            t.status = Status.Terminated;
          });
        }

        // if there are multiple outgoing paths that meet the condition, only one of them should be executed
        // TODO: sequences should be sorted by priority, instead of the first one
        if (matchedSequences.length >= 1) {
          outgoing = takeOutgoing([matchedSequences[0]]);
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
