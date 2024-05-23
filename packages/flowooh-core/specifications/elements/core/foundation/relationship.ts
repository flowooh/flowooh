import { IElement } from '../general/general';
import { BaseElement } from './baseElement';
import { RootElement } from './rootElement';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.79210
 */
export abstract class Relationship extends BaseElement {
  id: string;
  type: string;
  direction: RelationshipDirection;

  sources: IElement[];
  targets: IElement[];
}

export enum RelationshipDirection {
  None = 'none',
  Forward = 'forward',
  Backward = 'backward',
  Both = 'both',
}
