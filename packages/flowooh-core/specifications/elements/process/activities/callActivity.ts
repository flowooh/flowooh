import { RootElement } from '../../core/foundation/rootElement';
import { Interface } from '../../core/services/interface';
import { Operation } from '../../core/services/operation';
import { DataInput, DataOutput, InputOutputSpecification } from '../items/dataModeling';
import { Activity } from './activity';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.90309
 */
export abstract class CallActivity extends Activity {
  calledElement: CallableElement;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.131146
 */
export abstract class CallableElement extends RootElement {
  name: string;
  supportedInterfaceRefs: Interface[];
  ioSpecification: InputOutputSpecification;
  ioBinding: InputOutputBinding[];
}

/**
 * @see CallableElement
 */
export abstract class InputOutputBinding {
  inputDataRef: DataInput;
  outputDataRef: DataOutput;
  operationRef: Operation;
}
