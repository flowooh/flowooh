import { ConversationNode } from './conversationNode';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G10.110539
 */
export abstract class Conversation extends ConversationNode {}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G10.110581
 */
export abstract class SubConversation extends Conversation {
  conversationNodes: ConversationNode[];
}
