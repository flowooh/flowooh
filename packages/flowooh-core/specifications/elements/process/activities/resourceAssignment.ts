import { Expression } from '../../core/commonElements/expressions';
import { Resource, ResourceParameter } from '../../core/commonElements/resources';
import { BaseElement } from '../../core/foundation/baseElement';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.88482
 */
export abstract class ResourceRole extends BaseElement {
  resourceRef: Resource;
  resourceAssignmentExpression: ResourceAssignmentExpression;
  resourceParameterBindings: ResourceParameterBinding[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.88509
 */
export abstract class ResourceAssignmentExpression {
  expression: Expression;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.88529
 */
export abstract class ResourceParameterBinding {
  parameterRef: ResourceParameter;
  expression: Expression;
}
