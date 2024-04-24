import { BPMNProcess } from '@flowooh-core/types';

export class Attribute {
  protected process: BPMNProcess;

  $!: { id: string; name?: string };

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
