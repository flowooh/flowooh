import { Expression } from './expressions';
import { FlowElement } from './flowElement';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.82138
 */
export abstract class SequenceFlow extends FlowElement {
  sourceRef: FlowNode;
  targetRef: FlowNode;
  conditionExpression: Expression;
  isImmediate: boolean;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.82311
 */
export abstract class FlowNode extends FlowElement {
  incoming: SequenceFlow[];
  outgoing: SequenceFlow[];
}
