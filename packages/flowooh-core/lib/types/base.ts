import { Activity } from '@flowooh-core/base';
import { BPMNDefinition } from './bpmn';

export type Serializable<SerializeValue = Record<string, any>, OptionKeys extends string = string> = {
  serialize: (options: Record<OptionKeys, boolean>) => SerializeValue;
};

export type $ = {
  id: string;
  name?: string;
};

export type IdentityOptions = { id: string };

export type ProcessOptions = { xml: string } | { path: string } | { schema: BPMNDefinition };

export interface GoOutInterface {
  activity: Activity;
  pause?: boolean | string;
}
