import { Auditing } from '../../process/auditing/auditing';
import { Monitoring } from '../../process/monitoring/monitoring';
import { BaseElement } from '../foundation/baseElement';
import { CategoryValue } from './artifacts';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.90900
 */
export abstract class FlowElement extends BaseElement {
  name: string;
  categoryValueRef: CategoryValue[];
  auditing: Auditing;
  monitoring: Monitoring;
}
