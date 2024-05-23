import { CallableElement } from './callActivity';
import { ResourceRole } from './resourceAssignment';

export abstract class GlobalTask extends CallableElement {
  resources: ResourceRole[];
}
