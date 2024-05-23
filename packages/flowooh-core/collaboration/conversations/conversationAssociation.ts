import { BaseElement } from '../../core/foundation/baseElement';
import { ConversationNode } from './conversationNode';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G10.115783
 */
export abstract class ConversationAssociation extends BaseElement {
  innerConversationNodeRef: ConversationNode;
  outerConversationNodeRef: ConversationNode[];
}
