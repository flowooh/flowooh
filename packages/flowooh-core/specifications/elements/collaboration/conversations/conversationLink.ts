import { BaseElement } from '../../core/foundation/baseElement';
import { InteractionNode } from '../messageFlow/interactionNode';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G10.112551
 */
export abstract class ConversationLink extends BaseElement {
  name: string;
  sourceRef: InteractionNode;
  targetRef: InteractionNode;
}
