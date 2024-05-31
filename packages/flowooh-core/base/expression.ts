import { TemplateExecutor, template } from 'lodash';
import { BPMNConditionExpression, BPMNProcess } from '../types';

export class ConditionExpression {
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
