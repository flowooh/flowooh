import { BaseElement } from '../foundation/baseElement';
import { FlowElement } from './flowElement';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.80836
 */
export abstract class FlowElementsContainer extends BaseElement {
  flowElements: FlowElement[];
  laneSets: LaneSet[];
}

/**
 * TODO: LaneSet from Process
 */
export abstract class LaneSet {}
