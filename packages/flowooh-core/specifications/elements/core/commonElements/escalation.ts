import { ItemDefinition } from './itemDefinition';

export abstract class Escalation {
  structureRef: ItemDefinition;
  name: string;
  escalationCode: string;
}
