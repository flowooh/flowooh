import vm from 'vm';
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

  get expression(): (data: any) => boolean {
    try {
      const sandbox: vm.Context = { console: console };
      const script = new vm.Script(this.expressionString);
      const context = vm.createContext(sandbox);
      script.runInContext(context);

      if (context.condition && typeof context.condition === 'function') {
        return context.condition as (data: any) => boolean;
      } else {
        throw new Error('function condition is not defined or not a function');
      }
    } catch (e) {
      throw new Error(`Error parsing expression: ${this.expressionString}`);
    }
  }
}
