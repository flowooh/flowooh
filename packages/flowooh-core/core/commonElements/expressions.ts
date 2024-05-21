import { IElement } from '../general/general';
import { BaseElement } from '../foundation/baseElement';
import { ItemDefinition } from './itemDefinition';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.80725
 */
export abstract class Expression extends BaseElement {}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.80731
 */
export abstract class FormalExpression extends Expression {
  /**
   * The language MUST be specified in a URI format
   */
  language: string;

  body: IElement;

  evaluatesToTypeRef: ItemDefinition;
}
