import { $, BPMNProcess } from '@flowooh/core/types';
import { Association } from '../specifications/elements/core/commonElements/artifacts';

export class Attribute<Attrs = {}, Associations = {}> {
  protected process: BPMNProcess;

  $!: $<Attrs>['$'];

  constructor(process: BPMNProcess, data?: Partial<Attribute>) {
    if (data) Object.assign(this, data);
    this.process = process;
  }

  get id() {
    return this.$.id;
  }

  get name() {
    return this.$.name;
  }
}
