import { BPMNConditionExpression, BPMNProcess, BPMNSequenceFlow } from '@flowooh/core/types';
import { getActivity, getWrappedBPMNElement, logger } from '@flowooh/core/utils';
import { Attribute } from './attribute';
import { TemplateExecutor, template } from 'lodash';

const log = logger('gateway');

export class Sequence extends Attribute {
  declare $: { id: string; name?: string; sourceRef: string; targetRef: string };

  private readonly 'bpmn:conditionExpression': ConditionExpression | undefined;

  constructor(process: BPMNProcess, data?: Partial<Sequence>) {
    super(process, data);
    if (data) {
      Object.assign(this, data);
      this['bpmn:conditionExpression'] = data['bpmn:conditionExpression']?.[0]
        ? ConditionExpression.build(process, data['bpmn:conditionExpression'][0] || [])
        : undefined;
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
    return this['bpmn:conditionExpression'];
  }

  get condition() {
    if (!this.conditionExpression?.expression) {
      return () => null;
    }
    return (data: object) => {
      try {
        return this.conditionExpression?.expression(data);
      } catch (e) {
        log.warn(`Error evaluating expression: ${e.message}`);
        return false;
      }
    };
  }

  /**
   * returns an array of ${@link Sequence} object that INCOME to the current activity
   */
  // get conditionExpression(): ConditionExpression {}

  static build(process: BPMNProcess, el: BPMNSequenceFlow) {
    return new Sequence(process, { ...el });
  }
}

class ConditionExpression {
  declare $: { 'xsi:type': string; language: string };
  declare _: string;
  protected process: BPMNProcess;

  constructor(process: BPMNProcess, data?: Partial<ConditionExpression>) {
    if (data) Object.assign(this, data);
    this.process = process;
  }

  static build(process: BPMNProcess, el: BPMNConditionExpression) {
    return new ConditionExpression(process, { ...el });
  }

  get language() {
    if (this.$.language.includes('javascript')) return 'javascript';
  }

  get expressionString() {
    return this._;
  }

  get expression(): TemplateExecutor {
    try {
      return template(this.expressionString);
    } catch (e) {
      throw new Error(`Error parsing expression: ${this.expressionString}`);
    }
  }
}
