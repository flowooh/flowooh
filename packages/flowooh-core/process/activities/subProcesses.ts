import { Artifact } from '../../core/commonElements/artifacts';
import { Expression } from '../../core/commonElements/expressions';
import { FlowElement } from '../../core/commonElements/flowElement';
import { FlowElementsContainer } from '../../core/commonElements/flowElementContainer';
import { LaneSet } from '../lanes/lane';
import { Activity } from './activity';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.89610
 */
export abstract class SubProcess extends Activity implements FlowElementsContainer {
  flowElements: FlowElement[];
  laneSets: LaneSet[];

  triggeredByEvent: boolean = false;
  artifacts: Artifact[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.89997
 */
export abstract class Transaction extends SubProcess {
  method: string;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.90057
 */
export abstract class AdHocSubProcess extends SubProcess {
  completionCondition: Expression;
  ordering: AdHocOrdering;
  cancelRemainingInstances: boolean = true;
}

/**
 * @see AdHocSubProcess
 */
export enum AdHocOrdering {
  Parallel = 'parallel',
  Sequential = 'sequential',
}
