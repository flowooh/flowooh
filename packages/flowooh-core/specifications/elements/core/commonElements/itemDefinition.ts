import { IElement } from '../general/general';
import { RootElement } from '../foundation/rootElement';
import { Import } from '../infrastructure/import';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.81031
 */
export abstract class ItemDefinition extends RootElement {
  itemKind: ItemKind;
  structureRef: IElement;
  import: Import;
  isCollection: boolean;
}

enum ItemKind {
  Physical = 'Physical',
  Information = 'Information',
}
