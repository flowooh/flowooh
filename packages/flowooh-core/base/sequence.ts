import { $, BPMNConditionExpression, BPMNProcess, BPMNSequenceFlow } from '@flowooh/core/types';
import { getActivity, getWrappedBPMNElement, logger } from '@flowooh/core/utils';
import { Attribute } from './attribute';
import { ConditionExpression } from './expression';

const log = logger('gateway');

export class Sequence extends Attribute {
  declare $: $<{ sourceRef: string; targetRef: string }>['$'];

  private declare readonly $$: BPMNSequenceFlow['$$'];

  constructor(process: BPMNProcess, data?: Partial<Sequence>) {
    super(process, data);
    if (data) {
      Object.assign(this, data);
    }
  }

  get sourceRef() {
    if (!this.$.sourceRef) return null;
    return getActivity(this.process, getWrappedBPMNElement(this.process, { id: this.$.targetRef }));
  }

  get targetRef() {
    if (!this.$.targetRef) return null;
    return getActivity(this.process, getWrappedBPMNElement(this.process, { id: this.$.targetRef }));
  }

  get conditionExpression() {
    return this.$$?.['bpmn:conditionExpression']?.[0] ? ConditionExpression.build(this.process, this.$$['bpmn:conditionExpression'][0]) : undefined;
  }

  get condition() {
    if (!this.conditionExpression?.expression) {
      return () => null;
    }
    return (data: object) => {
      try {
        const result = this.conditionExpression?.expression(data);
        return result;
      } catch (e) {
        log.warn(`Error evaluating expression: ${e.message}`);
        return false;
      }
    };
  }

  /**
   * returns an array of ${@link Sequence} object that INCOME to the current activity
   */
  static build(process: BPMNProcess, el: BPMNSequenceFlow) {
    return new Sequence(process, { ...el });
  }
}
