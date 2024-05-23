import { Message } from '../commonElements/message';
import { BaseElement } from '../foundation/baseElement';
import { IElement } from '../general/general';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.93290
 */
export abstract class Operation extends BaseElement {
  name: string;
  inMessageRef: Message;
  outMessageRef: Message[];
  errorRef: Error[];
  implementationRef: IElement;
}
