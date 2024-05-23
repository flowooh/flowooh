import { RootElement } from '../foundation/rootElement';
import { ItemDefinition } from './itemDefinition';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.81121
 */
export abstract class Message extends RootElement {
  name: string;
  itemRef: ItemDefinition;
}
