import { CorrelationKey } from '../../core/commonElements/correlation';
import { BaseElement } from '../../core/foundation/baseElement';
import { MessageFlow } from '../messageFlow/messageFlow';
import { Participant } from '../pool/participants';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G10.110492
 */
export abstract class ConversationNode extends BaseElement {
  name: string;
  participantRefs: Participant[];
  messageFlowRefs: MessageFlow[];
  correlationKeys: CorrelationKey[];
}
