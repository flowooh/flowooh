import { FormalExpression } from './expressions';
import { Message } from './message';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.80256
 */
export abstract class CorrelationKey {
  name: string;
  correlationPropertyRef: CorrelationProperty[];
}

/**
 * CorrelationProperty
 * Key-based Correlation
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.80280
 */
export abstract class CorrelationProperty {
  name: string;
  type: string;
  correlationPropertyRetrievalExpression: CorrelationPropertyRetrievalExpression[];
}

/**
 * @see CorrelationProperty
 */
export abstract class CorrelationPropertyRetrievalExpression {
  messagePath: FormalExpression;
  messageRef: Message;
}

/**
 * CorrelationSubscription
 * Context-based Correlation
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.80322
 */
export abstract class CorrelationSubscription {
  correlationKeyRef: CorrelationKey;
  correlationPropertyBinding: CorrelationPropertyBinding[];
}

/**
 * @see CorrelationSubscription
 */
export abstract class CorrelationPropertyBinding {
  dataPath: FormalExpression;
  correlationPropertyRef: CorrelationProperty;
}
