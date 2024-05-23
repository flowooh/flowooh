import { Collaboration } from '../general/general';
import { ParticipantAssociation } from '../pool/participants';
import { ConversationNode } from './conversationNode';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G10.110621
 */
export abstract class CallConversation extends ConversationNode {
  calledCollaborationRef: Collaboration;
  participantAssociations: ParticipantAssociation[];
}
