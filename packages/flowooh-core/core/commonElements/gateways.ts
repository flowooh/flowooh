import { FlowNode } from './sequenceFlow';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.80910
 */
export abstract class Gateway extends FlowNode {
  gatewayDirection: GatewayDirection;
}

/**
 * @see Gateway
 */
export enum GatewayDirection {
  /**
   * There are no constraints. The Gateway MAY have any number of incoming and outgoing Sequence Flows.
   */
  Unspecified = 'unspecified',
  /**
   * This Gateway MAY have multiple incoming Sequence Flows but MUST have no more than one (1) outgoing Sequence Flow
   */
  Converging = 'converging',
  /**
   * This Gateway MAY have multiple outgoing Sequence Flows but MUST have no more than one (1) incoming Sequence Flow
   */
  Diverging = 'diverging',
  /**
   * This Gateway contains multiple outgoing and multiple incoming Sequence Flows
   */
  Mixed = 'mixed',
}
