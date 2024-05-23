import { RootElement } from '../foundation/rootElement';
import { ItemDefinition } from './itemDefinition';

export abstract class Error extends RootElement {
  structureRef: ItemDefinition;
  name: string;
  errorCode: string;
}
