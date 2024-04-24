import { Activity } from '../base/activity';
import { Sequence } from '../base/sequence';
import { Status, Token } from '../context';
import { BPMNGateway, BPMNProcess, BPMNSequenceFlow, GoOutInterface, IdentityOptions } from '../types';
import { getWrappedBPMNElement, takeOutgoing } from '../utils/utils';

export enum GatewayType {
  Complex = 'complex',
  Parallel = 'parallel',
  Inclusive = 'inclusive',
  Exclusive = 'exclusive',
  EventBased = 'eventBased',
}

export class GatewayActivity extends Activity {
  declare $: { id: string; name?: string; default?: string };

  constructor(process: BPMNProcess, data?: Partial<GatewayActivity>, key?: string) {
    super(process, data, key);
  }

  protected takeGatewayOutgoing(identity?: IdentityOptions) {
    let outgoing: Activity[] | undefined = takeOutgoing(this.outgoing, identity);

    switch (this.type) {
      case GatewayType.Complex:
        break;

      case GatewayType.Parallel:
        if (this.context && this.token) {
          const tokens = this.context.getTokens({ id: this.id });

          if (tokens?.length !== this.incoming?.length) {
            this.token.pause();
            return;
          } else if (this.incoming.length > 1) {
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

      case GatewayType.Inclusive:
        break;

      case GatewayType.Exclusive:
        if (outgoing && outgoing.length !== 1)
          outgoing = this.default?.targetRef ? [this.default.targetRef] : undefined;
        break;

      case GatewayType.EventBased:
        break;
    }

    return outgoing;
  }

  takeOutgoing(options: { identity?: IdentityOptions; pause?: boolean | string }) {
    if (!this.outgoing || !this.outgoing?.length) return;

    const outgoing = this.takeGatewayOutgoing(options?.identity);

    if (!outgoing) return;

    this.goOut(outgoing.map((out) => ({ activity: out, pause: options?.pause })));
  }

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
    if (!this.$.default) return;
    const flow = getWrappedBPMNElement(this.process, { id: this.$.default })?.element;
    if (flow) return Sequence.build(this.process, flow as BPMNSequenceFlow);
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
