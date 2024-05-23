import { Expression, FormalExpression } from '../../core/commonElements/expressions';
import { BaseElement } from '../../core/foundation/baseElement';
import { ImplicitThrowEvent } from '../events/event';
import { EventDefinition } from '../events/eventDefinition';
import { DataInput, DataOutput, ItemAwareElement } from '../items/dataModeling';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.90479
 */
export abstract class LoopCharacteristics extends BaseElement {}

export interface LoopActivity {
  /** instance attributes */
  loopCounter: number;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.90555
 */
export abstract class StandardLoopCharacteristics extends LoopCharacteristics {
  testBefore: boolean = false;
  loopMaximum: number;
  loopCondition: Expression;
}

export abstract class MultiInstanceLoopCharacteristics extends LoopCharacteristics {
  isSequential: boolean = false;
  loopCardinality: Expression;
  loopDataInputRef: ItemAwareElement;
  loopDataOutputRef: ItemAwareElement;
  inputDataItem: DataInput;
  outputDataItem: DataOutput;
  behavior: MultiInstanceBehavior;
  complexBehaviorDefinition: ComplexBehaviorDefinition;
  completionCondition: Expression;
  oneBehaviorEventRef: EventDefinition;
  noneBehaviorEventRef: EventDefinition;
}

export enum MultiInstanceBehavior {
  None = 'none',
  One = 'one',
  All = 'all',
  Complex = 'complex',
}

export interface MultiInstanceActivity {
  loopCounter: number;
  numberOfInstances: number;
  numberOfActiveInstances: number;
  numberOfCompletedInstances: number;
  numberOfTerminatedInstances: number;
}

export abstract class ComplexBehaviorDefinition extends BaseElement {
  condition: FormalExpression;
  event: ImplicitThrowEvent;
}
