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

/**
 * TODO: Auditing from Process
 */
export abstract class Auditing {}

/**
 * TODO: Monitoring from Process
 */
export abstract class Monitoring {}
