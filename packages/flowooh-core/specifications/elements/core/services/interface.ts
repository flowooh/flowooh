import { CallableElement } from '../../process/activities/callActivity';
import { RootElement } from '../foundation/rootElement';
import { IElement } from '../general/general';
import { Operation } from './operation';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.82802
 */
export abstract class Interface extends RootElement {
  name: string;
  operations: Operation[];
  callableElements: CallableElement[];
  implementationRef: IElement;
}
