import { Event as CommonEvent } from '../../core/commonElements/events';
import { Activity } from '../activities/activity';
import { DataInput, DataInputAssociation, DataOutput, DataOutputAssociation, InputSet, OutputSet, Property } from '../items/dataModeling';
import { EventDefinition } from './eventDefinition';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.137838
 */
export abstract class Event extends CommonEvent {
  properties: Property[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.92991
 */
export abstract class CatchEvent extends Event {
  eventDefinitionRefs: EventDefinition[];
  eventDefinitions: EventDefinition[];
  dataOutputAssociations: DataOutputAssociation[];
  dataOutputs: DataOutput[];
  outputSet: OutputSet;
  parallelMultiple: boolean = false;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.93033
 */
export abstract class ThrowEvent extends Event {
  eventDefinitionRefs: EventDefinition[];
  eventDefinitions: EventDefinition[];
  dataInputAssociations: DataInputAssociation[];
  dataInputs: DataInput[];
  InputSet: InputSet;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.93075
 */
export abstract class ImplicitThrowEvent extends ThrowEvent {}

/**
 * StartEvent
 *
 * A Start Event is OPTIONAL: a Process level(a top-level Process, a Sub-Process, or a Global Process) MAY have a Start Event.
 *
 * NOTE: A Process MAY have more than one Process level. The use of Start and End Event is independent for each level of the Diagram.
 *
 * Start Event Types for Top-level Processes: None, Message, Timer, COnditional, Signal, Multiple, Parallel Multiple
 * Start Event Types for Sub-Process: None
 * Start Event Types for Event Sub-Processes: Message, Timer, Escalation, Error, Compensation, Conditional, Signal, Multiple, Parallel Multiple
 *
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.93089
 */
export abstract class StartEvent extends CatchEvent {
  isInterrupting: boolean = true;
}

/**
 * EndEvent
 *
 * End Event Types: None, Message, Error, Escalation, Cancel, Compensation, Signal, Terminate, Multiple
 */
export abstract class EndEvent extends ThrowEvent {}

export abstract class IntermediateEvent {}

export abstract class BoundaryEvent extends CatchEvent {
  attachedTo: Activity;
  /**
   * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.94481
   */
  cancelActivity: boolean;
}
