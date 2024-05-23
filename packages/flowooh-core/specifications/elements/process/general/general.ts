import { Collaboration } from '../../collaboration/general/general';
import { Artifact } from '../../core/commonElements/artifacts';
import { CorrelationSubscription } from '../../core/commonElements/correlation';
import { CallableElement } from '../activities/callActivity';
import { ResourceRole } from '../activities/resourceAssignment';
import { Auditing } from '../auditing/auditing';
import { Property } from '../items/dataModeling';
import { Monitoring } from '../monitoring/monitoring';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.88054
 */
export abstract class Process extends CallableElement {
  processType: ProcessType;
  isExecutable: boolean;
  auditing: Auditing;
  monitoring: Monitoring;
  artifacts: Artifact[];
  isClosed: boolean = false;
  supports: Process[];
  properties: Property[];
  resources: ResourceRole[];
  correlationSubscriptions: CorrelationSubscription[];
  definitionalCollaborationRef: Collaboration;

  /** a Process instance has attributes whose values MAY be referenced by Expressions. These values are only available when the Process is being executed  */
  state: ActivityLifecycleState = ActivityLifecycleState.None;
}

/**
 * @see Process
 */
export enum ProcessType {
  None = 'none',
  Private = 'private',
  Public = 'public',
}

/**
 * TODO: ActivityLifecycleState from BPMN Execution Semantics
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G14.76198
 */
export enum ActivityLifecycleState {
  None = 'none',
  Ready = 'ready',
  Active = 'active',
  Completing = 'completing',
  Completed = 'completed',
  Failing = 'failing',
  Failed = 'failed',
  Compensating = 'compensating',
  Compensated = 'compensated',
  Terminating = 'terminating',
  Terminated = 'terminated',
  Withdrawn = 'withdrawn',
}
