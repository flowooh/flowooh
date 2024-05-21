import { BaseElement } from '../foundation/baseElement';
import { Extension } from '../foundation/extensibility';
import { Relationship } from '../foundation/relationship';
import { RootElement } from '../foundation/rootElement';
import { Import } from './import';

export abstract class Definitions extends BaseElement {
  name: string;
  targetNamespace: string;
  expressionLanguage: string;
  typeLanguage: string;
  rootElements: RootElement[];
  diagrams: BPMNDiagram[];
  imports: Import[];
  extensions: Extension[];
  relationships: Relationship[];
  exporters: string;
  exporterVersion: string;
}

/**
 * TODO: BPMNDiagram from BPMNDI
 */
export class BPMNDiagram {}
