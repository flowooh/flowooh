import { Choreography } from '../../choreography/general/general';
import { Artifact } from '../../core/commonElements/artifacts';
import { CorrelationKey } from '../../core/commonElements/correlation';
import { RootElement } from '../../core/foundation/rootElement';
import { ConversationAssociation } from '../conversations/conversationAssociation';
import { ConversationLink } from '../conversations/conversationLink';
import { ConversationNode } from '../conversations/conversationNode';
import { MessageFlow, MessageFlowAssociation } from '../messageFlow/messageFlow';
import { Participant, ParticipantAssociation } from '../pool/participants';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G10.109288
 */
export abstract class Collaboration extends RootElement {
  name: string;
  choreographyRef: Choreography[];
  correlationKeys: CorrelationKey[];
  conversationAssociations: ConversationAssociation[];
  conversations: ConversationNode[];
  conversationLinks: ConversationLink[];
  artifacts: Artifact[];
  participants: Participant[];
  participantAssociations: ParticipantAssociation[];
  messageFlow: MessageFlow[];
  messageFlowAssociations: MessageFlowAssociation[];
  isClosed: boolean;
}
