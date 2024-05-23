import { FlowNode } from '../../core/commonElements/sequenceFlow';
import { BaseElement } from '../../core/foundation/baseElement';
import { Process } from '../general/general';

/**
 * @see Lane
 */
export abstract class LaneSet extends BaseElement {
  name: string;
  process: Process;
  lanes: Lane[];
  parentLane: Lane;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.98679
 */
export abstract class Lane extends BaseElement {
  name: string;
  partitionElement: BaseElement;
  partitionElementRef: BaseElement;
  childLaneSet: LaneSet;
  flowNodeRefs: FlowNode[];
}
