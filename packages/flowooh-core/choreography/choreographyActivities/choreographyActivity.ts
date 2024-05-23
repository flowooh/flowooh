import { Collaboration } from '../../collaboration/general/general';
import { MessageFlow } from '../../collaboration/messageFlow/messageFlow';
import { Participant, ParticipantAssociation } from '../../collaboration/pool/participants';
import { Artifact } from '../../core/commonElements/artifacts';
import { CorrelationKey } from '../../core/commonElements/correlation';
import { FlowNode } from '../../core/commonElements/sequenceFlow';
import { CallableElement } from '../../process/activities/callActivity';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G12.71573
 */
export abstract class ChoreographyActivity extends FlowNode {
  participantRefs: Participant[];
  initiatingParticipantRef: Participant;
  loopType: ChoreographyLoopType;
  correlationKeys: CorrelationKey[];
}

export enum ChoreographyLoopType {
  None = 'None',
  Standard = 'Standard',
  MultiInstanceSequential = 'MultiInstanceSequential',
  MultiInstanceParallel = 'MultiInstanceParallel',
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G12.71675
 */
export abstract class ChoreographyTask extends ChoreographyActivity {
  messageFlowRef: MessageFlow[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G12.71944
 */
export abstract class SubChoreography extends ChoreographyActivity {
  artifacts: Artifact[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G12.81859
 */
export abstract class CallChoreography extends ChoreographyActivity {
  calledChoreographyRef: CallableElement;
  participantAssociations: ParticipantAssociation[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G12.72275
 */
export abstract class GlobalChoreographyTask extends Collaboration {
  initiatingParticipantRef: Participant;
}
