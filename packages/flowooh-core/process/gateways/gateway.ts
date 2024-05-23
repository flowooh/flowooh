import { Expression } from '../../core/commonElements/expressions';
import { Gateway as CommonGateway } from '../../core/commonElements/gateways';
import { SequenceFlow } from '../../core/commonElements/sequenceFlow';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.96832
 */
export abstract class Gateway extends CommonGateway {}

export abstract class ExclusiveGateway extends Gateway {
  default: SequenceFlow;
}

export abstract class InclusiveGateway extends Gateway {
  default: SequenceFlow;
}

export abstract class ParallelGateway extends Gateway {}

export abstract class ComplexGateway extends Gateway {
  default: SequenceFlow;
  activationCondition: Expression;
  /** instance attributes */
  activationCount: number;
  waitingForStart: boolean = true;
}

export abstract class EventBasedGateway extends Gateway {
  instantiate: boolean = false;
  eventGatewayType: EventBasedGatewayType;
}

export enum EventBasedGatewayType {
  Exclusive = 'exclusive',
  Parallel = 'parallel',
}
