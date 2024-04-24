import { TaskType } from '@flowooh-core/activities/task';
import { $ } from './base';

export type BPMNElement = {
  $: $;
};

export type BPMNEventDefinition =
  | { 'bpmn:linkEventDefinition'?: [BPMNElement] }
  | { 'bpmn:timerEventDefinition'?: [BPMNElement] }
  | { 'bpmn:errorEventDefinition'?: [BPMNElement] }
  | { 'bpmn:signalEventDefinition'?: [BPMNElement] }
  | { 'bpmn:messageEventDefinition'?: [BPMNElement] }
  | { 'bpmn:escalationEventDefinition'?: [BPMNElement] }
  | { 'bpmn:conditionalEventDefinition'?: [BPMNElement] }
  | { 'bpmn:compensationEventDefinition'?: [BPMNElement] };

export type BPMNParticipant = BPMNElement & { $: { processRef: string } };
export type BPMNMessageFlow = BPMNElement & {
  $: { sourceRef: string; targetRef: string };
};

export type BPMNCollaboration = BPMNElement & {
  'bpmn:participant': BPMNParticipant[];
  'bpmn:messageFlow': BPMNMessageFlow[];
};

export type BPMNDefinition = BPMNElement & {
  'bpmn:process': BPMNProcess[];
  'bpmn:collaboration': BPMNCollaboration[];
};

export type BPMNLane = BPMNElement & {
  'bpmn:flowNodeRef': string[];
};

export type BPMNLaneSet = BPMNElement & { 'bpmn:lane': BPMNLane[] };

export type BPMNStartEvent = BPMNElement & {
  'bpmn:outgoing': string[];
} & BPMNEventDefinition;

export type BPMNEndEvent = BPMNElement & {
  'bpmn:incoming': string[];
} & BPMNEventDefinition;

export type BPMNIntermediateEvent = BPMNElement & {
  'bpmn:incoming': string[];
  'bpmn:outgoing': string[];
} & BPMNEventDefinition;

export type BPMNBoundaryEvent = (BPMNElement & { $: { attachedToRef?: string } }) & {
  'bpmn:outgoing': string[];
} & BPMNEventDefinition;

export type BPMNTaskType =
  | 'bpmn:sendTask'
  | 'bpmn:userTask'
  | 'bpmn:manualTask'
  | 'bpmn:scriptTask'
  | 'bpmn:receiveTask'
  | 'bpmn:serviceTask'
  | 'bpmn:businessTask';

export type BPMNNormalGateway = (BPMNElement & { $: { default?: string } }) & {
  'bpmn:incoming': string[];
  'bpmn:outgoing': string[];
};

export type BPMNStrictGateway = BPMNElement & {
  'bpmn:incoming': string[];
  'bpmn:outgoing': string[];
};

export type BPMNProcess = BPMNElement & {
  'bpmn:isExecutable': boolean;
  'bpmn:laneSet'?: BPMNLaneSet[];
  'bpmn:task'?: BPMNTask[];
  'bpmn:endEvent'?: BPMNEndEvent[];
  'bpmn:startEvent'?: BPMNStartEvent[];
  'bpmn:sequenceFlow'?: BPMNSequenceFlow[];
  'bpmn:boundaryEvent'?: BPMNBoundaryEvent[];
} & {
  [x in BPMNTaskType]?: BPMNTask[];
} & {
  [x in 'bpmn:parallelGateway' | 'bpmn:eventBasedGateway']?: BPMNStrictGateway[];
} & {
  [x in 'bpmn:intermediateThrowEvent' | 'bpmn:intermediateCatchEvent']?: BPMNIntermediateEvent[];
} & {
  [x in 'bpmn:complexGateway' | 'bpmn:inclusiveGateway' | 'bpmn:exclusiveGateway']?: BPMNNormalGateway[];
} & {
  [x in 'bpmn:subProcess' | 'bpmn:transaction' | 'bpmn:callActivity']?: (BPMNElement & {
    'bpmn:triggeredByEvent'?: boolean;
  } & Omit<BPMNProcess, 'bpmn:isExecutable' | 'bpmn:laneSet'>)[];
};

export type BPMNEvent = BPMNStartEvent | BPMNEndEvent | BPMNBoundaryEvent | BPMNIntermediateEvent;

export type BPMNTask = BPMNElement & {
  $: {
    taskType: TaskType;
  };
};

export type BPMNSequenceFlow = BPMNElement & {
  $: {
    sourceRef: string;
    targetRef: string;
  };
};

export type BPMNGateway = BPMNElement & {
  $: {
    default?: string;
  };
} & {
  'bpmn:incoming': string[];
  'bpmn:outgoing': string[];
};

export type BPMNActivity =
  | BPMNGateway
  | BPMNEvent
  | BPMNTask
  | (BPMNElement & {
      'bpmn:triggeredByEvent'?: boolean;
    } & Omit<BPMNProcess, 'bpmn:isExecutable' | 'bpmn:laneSet'>);

/* It's a wrapper for the BPMN element. */
export interface WrappedElement {
  element: BPMNElement;
  key: string;
}
