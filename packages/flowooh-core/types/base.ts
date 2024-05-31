import { $, BPMNElement } from './bpmn';

/**
 * class that implements the Serializable interface must implement the serialize method
 * it is used for Context, State, Token, etc.
 */
export type Serializable<SerializeValue = Record<string, any>, OptionKeys extends string = string> = {
  serialize: (options: Record<OptionKeys, boolean>) => SerializeValue;
};

/**
 * IdentityOptions is used to identify an element in the BPMN process
 * bpmn element could be found by id or name
 */
export type IdentityOptions = Required<Pick<$['$'], 'id'>> | Required<Pick<$['$'], 'name'>>;

/* It's a wrapper for the BPMN element. */
export interface WrappedElement<T extends BPMNElement = BPMNElement> {
  element: T;
  key: string;
}
