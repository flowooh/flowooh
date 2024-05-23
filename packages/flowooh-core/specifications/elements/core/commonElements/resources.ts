import { BaseElement } from '../foundation/baseElement';
import { RootElement } from '../foundation/rootElement';
import { ItemDefinition } from './itemDefinition';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.81887
 */
export abstract class Resource extends RootElement {
  name: string;
  resourceParameters: ResourceParameter[];
}

/**
 * @see Resource
 */
export abstract class ResourceParameter extends BaseElement {
  name: string;
  type: ItemDefinition;
  value: string;
}
