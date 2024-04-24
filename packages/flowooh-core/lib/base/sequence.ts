import { BPMNProcess, BPMNSequenceFlow } from '@flowooh-core/types';
import { getActivity, getWrappedBPMNElement } from '@flowooh-core/utils';
import { Attribute } from './attribute';

export class Sequence extends Attribute {
  declare $: { id: string; name?: string; sourceRef: string; targetRef: string };

  get sourceRef() {
    if (!this.$.sourceRef) return null;
    return getActivity(this.process, getWrappedBPMNElement(this.process, { id: this.$.targetRef }));
  }

  get targetRef() {
    if (!this.$.targetRef) return null;
    return getActivity(this.process, getWrappedBPMNElement(this.process, { id: this.$.targetRef }));
  }

  static build(process: BPMNProcess, el: BPMNSequenceFlow) {
    return new Sequence(process, { ...el });
  }
}
