import { BPMNDefinition, WrappedElement } from './bpmn';

/* It's a container for BPMN definitions */
export interface DefinitionContainer {
  [id: string]: BPMNDefinition;
}

/* It's a container for BPMN elements. */
export interface ElementContainer {
  [id: string]: { [id: string]: WrappedElement };
}
