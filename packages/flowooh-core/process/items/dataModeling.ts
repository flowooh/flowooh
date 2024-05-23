import { Expression } from '../../core/commonElements/expressions';
import { FlowElement } from '../../core/commonElements/flowElement';
import { ItemDefinition } from '../../core/commonElements/itemDefinition';
import { BaseElement } from '../../core/foundation/baseElement';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.91171
 */
export abstract class ItemAwareElement extends BaseElement {
  itemSubjectRef: ItemDefinition;
  dataState: DataState;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.91357
 */
export abstract class DataObject extends FlowElement {
  isCollection: boolean = false;
}

/**
 * @see DataObject
 */
export abstract class DataObjectReference extends ItemAwareElement {
  dataObjectRef: DataObject;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.91411
 */
export abstract class DataState extends BaseElement {
  name: string;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.91510
 */
export abstract class DataStore extends FlowElement {
  name: string;
  capacity: number;
  isUnlimited: boolean = false;
}

/**
 * @see DataStore
 */
export abstract class DataStoreReference {
  dataStoreRef: DataStore;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.132322
 */
export abstract class Property extends ItemAwareElement {
  name: string;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.91693
 */
export abstract class InputOutputSpecification extends BaseElement {
  inputSets: InputSet[];
  outputSets: OutputSet[];
  dataInputs: DataInput[];
  dataOutputs: DataOutput[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.91776
 */
export abstract class DataInput extends ItemAwareElement {
  name: string;
  inputSetRefs: InputSet[];
  inputSetWithOptional: InputSet[];
  inputSetWithWhileExecuting: InputSet[];
  isCollection: boolean = false;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.91874
 */
export abstract class DataOutput extends ItemAwareElement {
  name: string;
  outputSetRefs: OutputSet[];
  outputSetWithOptional: OutputSet[];
  outputSetWithWhileExecuting: OutputSet[];
  isCollection: boolean = false;
}

/**
 * @seehttps://www.omg.org/spec/BPMN/2.0.2/PDF#G11.137403
 */
export abstract class InputSet extends BaseElement {
  name: string;
  dataInputRefs: DataInput[];
  optionalInputRefs: DataInput[];
  whileExecutingInputRefs: DataInput[];
  outputSetRefs: OutputSet[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.92106
 */
export abstract class OutputSet extends BaseElement {
  name: string;
  dataOutputRefs: DataOutput[];
  optionalOutputRefs: DataOutput[];
  whileExecutingOutputRefs: DataOutput[];
  inputSetRefs: InputSet[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.92188
 */
export abstract class DataAssociation extends BaseElement {
  transformation: Expression;
  assignment: Assignment[];
  sourceRef: ItemAwareElement[];
  targetRef: ItemAwareElement[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.92306
 */
export abstract class Assignment extends BaseElement {
  from: Expression;
  to: Expression;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.92337
 */
export abstract class DataInputAssociation extends DataAssociation {}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.92340
 */
export abstract class DataOutputAssociation extends DataAssociation {}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G11.92442
 */
export interface XPathExtensionFunction {
  getDataObject(processName: string | undefined, dataObjectName: string): DataObject;

  getDataInput(dataInputName: string): DataInput;
  getDataOutput(dataOutputName: string): DataOutput;

  getProcessProperty(processName: string | undefined, propertyName: string): Property;
  getActivityProperty(activityName: string, propertyNam: string): Property;
  getEventProperty(eventName: string, propertyName: string): Property;

  getProcessInstanceAttribute(processName: string | undefined, attributeName: string): any;
  getChoreographyInstanceAttribute(attributeName: string): any;
  getActivityInstanceAttribute(activityName: string, attributeName: string): any;
}
