import { Documentation } from './documentation';

/**
 * BaseElement
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.78881
 */
export abstract class BaseElement {
  id: string;
  documentation: Documentation[];
}
