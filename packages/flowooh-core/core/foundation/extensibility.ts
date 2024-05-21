/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.79020
 */
export abstract class Extension {
  mustUnderstand: boolean;
  definition: string;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.79045
 */
export abstract class ExtensionDefinition {
  name: string;
  extensionAttributeDefinitions: string;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.79069
 */
export abstract class ExtensionAttributeDefinition {
  name: string;
  type: string;
  isReference: boolean;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.79097
 */
export abstract class ExtensionAttributeValue {
  value: string;
  valueRef: string;
  extensionAttributeDefinition: string;
}
