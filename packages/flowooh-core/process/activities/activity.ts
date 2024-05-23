import { FlowNode, SequenceFlow } from '../../core/commonElements/sequenceFlow';
import { BoundaryEvent } from '../events/event';
import { ActivityLifecycleState } from '../general/general';
import { DataInputAssociation, DataOutputAssociation, InputOutputSpecification, Property } from '../items/dataModeling';
import { LoopCharacteristics } from './loopCharacteristics';
import { ResourceRole } from './resourceAssignment';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.88277
 */
export abstract class Activity extends FlowNode {
  isForCompensation: boolean = false;
  loopCharacteristics: LoopCharacteristics;
  resources: ResourceRole[];
  default: SequenceFlow;
  ioSpecification: InputOutputSpecification;
  properties: Property[];
  boundaryEventRefs: BoundaryEvent[];
  dataInputAssociations: DataInputAssociation[];
  dataOutputAssociations: DataOutputAssociation[];
  startQuantity: number = 1;
  completionQuantity: number = 1;

  /** instance attributes */
  state: ActivityLifecycleState = ActivityLifecycleState.None;
}
