import { TaskActivity } from '@flowooh/core/activities';
import { Context, State, Status, Token } from '@flowooh/core/context';
import { $$, BPMNActivity, BPMNProcess, BPMNSequenceFlow, IdentityOptions, TaskType } from '@flowooh/core/types';
import { getWrappedBPMNElement, takeOutgoing } from '@flowooh/core/utils';
import { Attribute } from './attribute';
import { Sequence } from './sequence';

export class Activity extends Attribute {
  protected readonly key?: string;

  public token?: Token;
  public context?: Context;

  declare readonly $$: BPMNActivity['$$'];

  constructor(process: BPMNProcess, data?: Partial<Activity>, key?: string) {
    super(process, data);
    if (data) Object.assign(this, data);
    this.key = key;
  }

  /**
   * returns an array of ${@link Sequence} object that INCOME to the current activity
   */
  get incoming(): Sequence[] {
    const flows = this.$$['bpmn:incoming']
      ?.map((id: string) => {
        const flow = getWrappedBPMNElement<BPMNSequenceFlow>(this.process, { id })?.element;
        if (flow) return Sequence.build(this.process, flow);
      })
      .filter((f) => f instanceof Sequence) as Sequence[];
    return flows;
  }

  /**
   * returns an array of ${@link Sequence} object that OUTCOME from the current activity
   */
  get outgoing(): Sequence[] {
    return this.$$['bpmn:outgoing']
      ?.map((id: string) => {
        const flow = getWrappedBPMNElement<BPMNSequenceFlow>(this.process, { id })?.element;
        if (flow) return Sequence.build(this.process, flow);
      })
      .filter((f) => f instanceof Sequence) as Sequence[];
  }

  /**
   * It accepts SPECIFIED outgoing sequence flow from the current activity, and creates a new token for each sequence flow,
   * and "pause" is a boolean indicating whether the activity should be paused or not.
   */
  takeOutgoing(options?: { identity?: IdentityOptions; pause?: boolean | string }) {
    if (!this.outgoing || !this.outgoing?.length) return;

    const outgoing = takeOutgoing(this.outgoing, options?.identity);

    if (!outgoing) return;

    this.goOut(outgoing.map((out) => ({ activity: out, pause: options?.pause })));
  }

  /**
   * It accepts SPECIFIED outgoing sequences flow from the current activity, and creates multiple new token for each sequence flow,
   * and "pause" is a boolean indicating whether the activity should be paused or not.
   */
  takeOutgoings(options: { identity?: IdentityOptions; pause?: boolean | string }[]) {
    if (!this.outgoing || !this.outgoing?.length) return;

    const outgoing: { [id: string]: GoOutInterface } = {};

    for (const option of options) {
      const { identity, pause } = option;
      const activity = takeOutgoing(this.outgoing, identity)?.pop();

      if (activity) outgoing[activity.id] = { activity, pause };
    }

    this.goOut(Object.values(outgoing));
  }

  protected pause(out: GoOutInterface) {
    if (!out) return false;
    const flag = typeof out.pause === 'string' ? out.pause === out.activity.id || out.pause === out.activity.name : out.pause;
    if (typeof flag === 'boolean') return flag;
    return out.activity instanceof TaskActivity && out.activity.taskType === TaskType.User;
  }

  /**
   * This function handles outgoing transitions for each token in a workflow system.
   */
  protected goOut(outgoing: GoOutInterface[]) {
    if (outgoing?.length && this.token) {
      if (outgoing.length === 1) {
        this.token.status = Status.Completed;

        const out = outgoing.pop();

        this.token.push(
          State.build(out!.activity!.id, {
            name: out!.activity!.name,
            status: this.pause(out!) ? Status.Paused : Status.Ready,
          }),
        );
      }

      if (outgoing.length > 1 && this.context) {
        this.token.locked = true;
        this.token.status = Status.Terminated;

        for (const out of outgoing) {
          const token = Token.build({
            parent: this.token.id,
          });

          token.push(
            State.build(out.activity.id, {
              name: out.activity.name,
              status: this.pause(out) ? Status.Paused : Status.Ready,
            }),
          );

          this.context.addToken(token);
        }
      }
    }
  }

  isEnd() {
    return this.key?.includes('endEvent');
  }

  isStart() {
    return this.key?.includes('startEvent');
  }

  static build(el: BPMNActivity, process: BPMNProcess, key?: string) {
    return new Activity(process, { ...el }, key);
  }
}

export interface GoOutInterface {
  activity: Activity;
  pause?: boolean | string;
}
