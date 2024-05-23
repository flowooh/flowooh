import { BaseElement } from '../../core/foundation/baseElement';
import { RootElement } from '../../core/foundation/rootElement';
import { EndPoint } from '../../core/services/endPoint';
import { Interface } from '../../core/services/interface';
import { InteractionNode } from '../messageFlow/interactionNode';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G10.107597
 */
export abstract class Participant extends BaseElement implements InteractionNode {
  name: string;
  processRef: Process;
  partnerRoleRef: PartnerRole[];
  partnerEntityRef: PartnerEntity[];
  interfaceRef: Interface[];
  participantMultiplicity: ParticipantMultiplicity;
  endPointRefs: EndPoint[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G10.110940
 */
export abstract class PartnerEntity extends RootElement {
  name: string;
  participantRef: Participant[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G10.110957
 */
export abstract class PartnerRole extends RootElement {
  name: string;
  participantRef: Participant[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G10.110974
 */
export abstract class ParticipantMultiplicity {
  minimum: number = 0;
  maximum: number = 1;
  /** instance attributes */
  numParticipants: number;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G10.111025
 */
export abstract class ParticipantAssociation extends BaseElement {
  innerParticipantRef: Participant;
  outerParticipantRef: Participant;
}
