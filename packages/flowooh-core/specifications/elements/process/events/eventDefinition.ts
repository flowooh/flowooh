import { Error } from '../../core/commonElements/error';
import { Escalation } from '../../core/commonElements/escalation';
import { Expression } from '../../core/commonElements/expressions';
import { ItemDefinition } from '../../core/commonElements/itemDefinition';
import { Message } from '../../core/commonElements/message';
import { RootElement } from '../../core/foundation/rootElement';
import { Operation } from '../../core/services/operation';
import { Activity } from '../activities/activity';

/**
 * Event Definitions refers to the triggers of Catch Events and the results of Throw Events.
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.94578
 */
export abstract class EventDefinition extends RootElement {}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.95102
 */
export abstract class CancelEventDefinition extends EventDefinition {}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.95119
 */
export abstract class CompensationEventDefinition extends EventDefinition {
  /**
   * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.98547
   */
  activityRef: Activity;
  waitForCompletion: boolean = true;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.95549
 */
export abstract class ConditionalEventDefinition extends EventDefinition {
  condition: Expression;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.122403
 */
export abstract class ErrorEventDefinition extends EventDefinition {
  error: Error;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.118728
 */
export abstract class EscalationEventDefinition extends EventDefinition {
  escalationRef: Escalation;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.95758
 */
export abstract class LinkEventDefinition extends EventDefinition {
  name: string;
  sources: LinkEventDefinition[];
  target: LinkEventDefinition;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.122570
 */
export abstract class MessageEventDefinition extends EventDefinition {
  messageRef: Message;
  operationRef: Operation;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.95873
 */
export abstract class SignalEventDefinition extends EventDefinition {
  signalRef: Signal;
}

/**
 * @see SignalEventDefinition
 */
export abstract class Signal {
  name: string;
  structureRef: ItemDefinition;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.96172
 */
export abstract class TerminateEventDefinition extends EventDefinition {}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.96183
 */
export abstract class TimerEventDefinition extends EventDefinition {
  timeDate: Expression;
  timeCycle: Expression;
  timeDuration: Expression;
}
