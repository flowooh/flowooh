import { Message } from '../../core/commonElements/message';
import { Operation } from '../../core/services/operation';
import { Activity } from './activity';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.88561
 */
export abstract class Task extends Activity {}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.88709
 */
export abstract class ServiceTask extends Task {
  implementation: string;
  operationRef: Operation;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.88799
 */
export abstract class SendTask extends Task {
  messageRef: Message;
  operationRef: Operation;
  implementation: string;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.88867
 */
export abstract class ReceiveTask extends Task {
  messageRef: Message;
  operationRef: Operation;
  implementation: string;
}

/**
 * TODO: UseTask is introduced in "Human Interactions"
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.88962
 */
export abstract class UserTask extends Task {
  implementation: string;
  renderings: Rendering[];
  /** instance attributes */
  actualOwner: string;
  taskPriority: number;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.89000
 */
export abstract class ManualTask extends Task {}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.89025
 */
export abstract class BusinessRuleTask extends Task {
  implementation: string;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.89077
 */
export abstract class ScriptTask extends Task {
  scriptFormat: string;
  script: string;
}

/**
 * @see UserTask
 * @see http://docs.oasis-open.org/ns/bpel4people/ws-humantask/protocol/200803
 */
export abstract class Rendering {}
