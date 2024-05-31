import { Activity } from '@flowooh/core/base';
import { $, BPMNBoundaryEvent, BPMNProcess, BPMNTask, TaskType } from '@flowooh/core/types';
import { getActivity, getWrappedBPMNElement } from '@flowooh/core/utils';
import { EventActivity } from './event';

export class TaskActivity extends Activity {
  declare $: $['$'];

  constructor(process: BPMNProcess, data?: Partial<TaskActivity>, key?: string) {
    super(process, data, key);
  }

  /**
   * Get all boundary events attached to this task
   */
  get attachments(): EventActivity[] {
    const boundaries = (this.process['bpmn:boundaryEvent'] ?? [])
      .filter((e) => e.$.attachedToRef === this.$.id)
      .map((e) => getWrappedBPMNElement<BPMNBoundaryEvent>(this.process, e.$));

    return boundaries.filter((e) => !!e).map((e) => getActivity(this.process, e) as EventActivity);
  }

  get taskType() {
    if (this.key?.toLowerCase()?.includes('send')) return TaskType.Send;
    if (this.key?.toLowerCase()?.includes('user')) return TaskType.User;
    if (this.key?.toLowerCase()?.includes('manual')) return TaskType.Manual;
    if (this.key?.toLowerCase()?.includes('script')) return TaskType.Script;
    if (this.key?.toLowerCase()?.includes('receive')) return TaskType.Receive;
    if (this.key?.toLowerCase()?.includes('service')) return TaskType.Service;
    if (this.key?.toLowerCase()?.includes('business')) return TaskType.Business;
  }

  static build(el: BPMNTask, process: BPMNProcess, key?: string) {
    return new TaskActivity(process, { ...el }, key);
  }
}
