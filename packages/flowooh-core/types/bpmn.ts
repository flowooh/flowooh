/**
 * BPMN element attributes, defined in tag's attributes.
 *
 * a BPMN XML element:
 * ```xml
 * <bpmn:userTask id="userTaskId" name="userTask"></bpmn:userTask>
 * ```
 * would be represented as:
 * ```json
 * { "bpmn:userTask": { "$": { "id": "userTaskId", "name": "userTask" } } }
 * ```
 */
export type $<T extends any = {}> = {
  $: { id: string; name?: string } & {
    [key in keyof T]: T[key];
  };
};

/**
 * BPMN element associations, defined in tag's children.
 *
 * a BPMN XML element:
 * ```xml
 * <bpmn:process>
 *  <bpmn:userTask id="userTaskId" name="userTask"></bpmn:userTask>
 * </bpmn:process>
 * ```
 * would be represented as:
 * ```json
 * { "bpmn:process": { "bpmn:userTask": { "$": { "id": "userTaskId", "name": "userTask" } } } }
 * ```
 */
export type $$<T> = T extends string[] ? { $$: string[] } : T extends string ? { _: T } : { $$: { [key in keyof T]: T[key] } };

/**
 * BPMN base element. all BPMN elements should extend this type.
 */
export type BPMNElement<Attributes = {}, Associations = {}> = $<Attributes> & $$<Associations>;

/**
 * BPMN Event Definition
 */
export type BPMNEventDefinition =
  | { 'bpmn:linkEventDefinition'?: [BPMNElement] }
  | { 'bpmn:timerEventDefinition'?: [BPMNElement] }
  | { 'bpmn:errorEventDefinition'?: [BPMNElement] }
  | { 'bpmn:signalEventDefinition'?: [BPMNElement] }
  | { 'bpmn:messageEventDefinition'?: [BPMNElement] }
  | { 'bpmn:escalationEventDefinition'?: [BPMNElement] }
  | { 'bpmn:conditionalEventDefinition'?: [BPMNElement] }
  | { 'bpmn:compensationEventDefinition'?: [BPMNElement] };

export type BPMNStartEvent = BPMNElement<void, { 'bpmn:outgoing': string[] }> & BPMNEventDefinition;

export type BPMNEndEvent = BPMNElement<void, { 'bpmn:incoming': string[] }> & BPMNEventDefinition;

export type BPMNIntermediateEvent = BPMNElement<void, { 'bpmn:incoming': string[]; 'bpmn:outgoing': string[] }> & BPMNEventDefinition;

export type BPMNBoundaryEvent = BPMNElement<{ attachedToRef?: string }, { 'bpmn:outgoing': string[] }> & BPMNEventDefinition;

/**
 * BPMN Task Definition
 */
export type BPMNTaskType =
  | 'bpmn:sendTask'
  | 'bpmn:userTask'
  | 'bpmn:manualTask'
  | 'bpmn:scriptTask'
  | 'bpmn:receiveTask'
  | 'bpmn:serviceTask'
  | 'bpmn:businessTask';

export enum TaskType {
  Send = 'send',
  User = 'user',
  Manual = 'manual',
  Script = 'script',
  Receive = 'receive',
  Service = 'service',
  Business = 'business',
}

export type BPMNResourceParameter = BPMNElement<{ name: string; isRequired: boolean }>;

export type BPMNResource = BPMNElement<{ name: string }, { 'bpmn:resourceParameters': BPMNResourceParameter[] }>;

export type BPMNResourceParameterBinding = BPMNElement<{ parameterRef: string }, { 'bpmn:formalExpression': string }>;

export type BPMNResourceAssignmentExpression = BPMNElement<void, { 'bpmn:formalExpression': string }>;

export type BPMNResourceRole = BPMNElement<
  void,
  {
    'bpmn:resourceRef': [string];
    'bpmn:resourceParameterBinding': BPMNResourceParameterBinding[];
    'bpmn:resourceAssignmentExpression': BPMNResourceAssignmentExpression[];
  }
>;

export type BPMNPotentialOwner = BPMNResourceRole;

export type BPMNTask = BPMNElement<{ taskType: TaskType }, { 'bpmn:potentialOwner': BPMNPotentialOwner[] }>;

/**
 * BPMN Gateway Definition
 */
export type BPMNNormalGateway = BPMNElement<{ default?: string }, { 'bpmn:incoming': string[]; 'bpmn:outgoing': string[] }>;

export type BPMNStrictGateway = BPMNElement<void, { 'bpmn:incoming': string[]; 'bpmn:outgoing': string[] }>;

export type BPMNGateway = BPMNElement<{ default?: string }, { 'bpmn:incoming': string[]; 'bpmn:outgoing': string[] }>;

/**
 * BPMN Sequence Flow Definition
 */
export type BPMNSequenceFlow = BPMNElement<{ sourceRef: string; targetRef: string }, { 'bpmn:conditionExpression': [BPMNConditionExpression] }>;

export type BPMNConditionExpression = BPMNElement<{ 'xsi:type': string; language: string }, string>;

/**
 * BPMN Definition, bpmn:definitions
 */
export type BPMNDefinition = BPMNElement<void, { 'bpmn:process': BPMNProcess[]; 'bpmn:collaboration': BPMNCollaboration[] }>;

export type BPMNProcess = BPMNElement<
  void,
  {
    'bpmn:isExecutable': boolean;
    'bpmn:laneSet'?: BPMNLaneSet[];
    'bpmn:task'?: BPMNTask[];
    'bpmn:endEvent'?: BPMNEndEvent[];
    'bpmn:startEvent'?: BPMNStartEvent[];
    'bpmn:sequenceFlow'?: BPMNSequenceFlow[];
    'bpmn:boundaryEvent'?: BPMNBoundaryEvent[];
    'bpmn:resource'?: BPMNResource[];
  } & {
    [x in BPMNTaskType]?: BPMNTask[];
  } & {
    [x in 'bpmn:parallelGateway' | 'bpmn:eventBasedGateway']?: BPMNStrictGateway[];
  } & {
    [x in 'bpmn:intermediateThrowEvent' | 'bpmn:intermediateCatchEvent']?: BPMNIntermediateEvent[];
  } & {
    [x in 'bpmn:complexGateway' | 'bpmn:inclusiveGateway' | 'bpmn:exclusiveGateway']?: BPMNNormalGateway[];
  }
> & {
  [x in 'bpmn:subProcess' | 'bpmn:transaction' | 'bpmn:callActivity']?: (BPMNElement & {
    'bpmn:triggeredByEvent'?: boolean;
  } & Omit<BPMNProcess, 'bpmn:isExecutable' | 'bpmn:laneSet'>)[];
};

export type BPMNSubProcess = BPMNElement<void, { 'bpmn:triggeredByEvent'?: boolean }> & Omit<BPMNProcess, 'bpmn:isExecutable' | 'bpmn:laneSet'>;

export type BPMNCollaboration = BPMNElement<void, { 'bpmn:participant': BPMNParticipant; 'bpmn:messageFlow': BPMNMessageFlow }>;

export type BPMNParticipant = BPMNElement<{ processRef: string }>;

export type BPMNMessageFlow = BPMNElement<{ sourceRef: string; targetRef: string }>;

export type BPMNLaneSet = BPMNElement<void, { 'bpmn:lane': BPMNLane[] }>;

export type BPMNLane = BPMNElement<void, { 'bpmn:flowNodeRef': string[] }>;

/**
 * Combined BPMN Element Type
 * Some BPMN elements are strictly defined,
 * exp1: bpmn:startEvent, bpmn:endEvent, bpmn:boundaryEvent, or bpmn:intermediateEvent are all events.
 * exp2: gateway, event, task are all activities.
 */
export type BPMNEvent = BPMNStartEvent | BPMNEndEvent | BPMNBoundaryEvent | BPMNIntermediateEvent;

export type BPMNActivity = BPMNGateway | BPMNEvent | BPMNTask | BPMNSubProcess;
