import { Activity } from '@flowooh/core/base';
import { BPMNEvent, BPMNProcess } from '@flowooh/core/types';
import { getActivity, getWrappedBPMNElement } from '@flowooh/core/utils';
import { TaskActivity } from './task';

enum EventType {
  End = 'end',
  Start = 'start',
  Boundary = 'boundary',
  Intermediate = 'intermediate',
}

enum IntermediateType {
  Throw = 'throw',
  Catch = 'catch',
}

enum EventDefinitionType {
  Link = 'link',
  Timer = 'timer',
  Error = 'error',
  Signal = 'signal',
  Message = 'message',
  Escalation = 'escalation',
  Conditional = 'conditional',
  Compensation = 'compensation',
}

export class EventActivity extends Activity {
  declare $: {
    id: string;
    name?: string;
    attachedToRef?: string;
  };

  constructor(process: BPMNProcess, data?: Partial<EventActivity>, key?: string) {
    if (data?.attachedToRef && data.type !== EventType.Boundary) {
      throw new Error('attachedToRef should only be set for boundary events');
    }
    if (data?.intermediateType && data.type !== EventType.Intermediate) {
      throw new Error('intermediateType should only be set for intermediate events');
    }
    super(process, data, key);
  }

  get attachedToRef(): TaskActivity | undefined {
    if (!this.$.attachedToRef) return;
    const data = getWrappedBPMNElement(this.process, { id: this.$.attachedToRef });
    if (data) return getActivity(this.process, data) as TaskActivity;
  }

  get type() {
    if (this.$.attachedToRef) return EventType.Boundary;
    if (this.key?.toLowerCase()?.includes('end')) return EventType.End;
    if (this.key?.toLowerCase()?.includes('start')) return EventType.Start;
    if (this.key?.toLowerCase()?.includes('intermediate')) return EventType.Intermediate;
  }

  get intermediateType() {
    if (this.key?.toLowerCase()?.includes('throw')) return IntermediateType.Throw;
    if (this.key?.toLowerCase()?.includes('catch')) return IntermediateType.Catch;
  }

  get eventDefinitionType(): EventDefinitionType | undefined {
    if ('bpmn:linkEventDefinition' in this) return EventDefinitionType.Link;
    else if ('bpmn:timerEventDefinition' in this) return EventDefinitionType.Timer;
    else if ('bpmn:errorEventDefinition' in this) return EventDefinitionType.Error;
    else if ('bpmn:signalEventDefinition' in this) return EventDefinitionType.Signal;
    else if ('bpmn:messageEventDefinition' in this) return EventDefinitionType.Message;
    else if ('bpmn:escalationEventDefinition' in this) return EventDefinitionType.Escalation;
    else if ('bpmn:conditionalEventDefinition' in this) return EventDefinitionType.Conditional;
    else if ('bpmn:compensationEventDefinition' in this) return EventDefinitionType.Compensation;
  }

  static build(el: BPMNEvent, process: BPMNProcess, key?: string) {
    return new EventActivity(process, { ...el }, key);
  }
}
