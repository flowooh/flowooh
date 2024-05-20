import { Activity, GoOutInterface } from '@flowooh/core/base';
import { BPMNProcess, BPMNTask } from '@flowooh/core/types';
import { getActivity, getWrappedBPMNElement } from '@flowooh/core/utils';
import { EventActivity } from './event';

export enum TaskType {
  Send = 'send',
  User = 'user',
  Manual = 'manual',
  Script = 'script',
  Receive = 'receive',
  Service = 'service',
  Business = 'business',
}

export class TaskActivity extends Activity {
  declare $: {
    id: string;
    name?: string;
  };

  constructor(process: BPMNProcess, data?: Partial<TaskActivity>, key?: string) {
    super(process, data, key);
  }

  protected pause(out: GoOutInterface): boolean {
    if (!out) return false;

    let flag = false;
    if (out.activity instanceof TaskActivity && out.activity.taskType === TaskType.User) {
      flag = true;
    }
    const superFlag = super.pause(out);
    return typeof superFlag === 'boolean' ? superFlag : flag;
  }

  /**
   * Get all boundary events attached to this task
   */
  get attachments(): EventActivity[] {
    const boundaries = (this.process['bpmn:boundaryEvent'] ?? [])
      .filter((e) => e.$.attachedToRef === this.$.id)
      .map((e) => getWrappedBPMNElement(this.process, e.$));

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
