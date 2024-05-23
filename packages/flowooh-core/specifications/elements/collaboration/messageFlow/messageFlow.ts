import { Message } from '../../core/commonElements/message';
import { BaseElement } from '../../core/foundation/baseElement';
import { InteractionNode } from './interactionNode';

/**
 * @see MessageFlowAssociation
 */
export abstract class MessageFlow extends BaseElement {
  name: string;
  sourceRef: InteractionNode;
  targetRef: InteractionNode;
  messageRef: Message;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G10.110234
 */
export abstract class MessageFlowAssociation extends BaseElement {
  sourceRef: MessageFlow;
  targetRef: MessageFlow;
}
