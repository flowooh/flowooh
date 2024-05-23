import { Collaboration } from '../../collaboration/general/general';

/**
 * A Choreography is a type of process, but differs in purpose and behavior from a standard BPMN Process.
 */
export abstract class Choreography extends Collaboration {
  /** The Collaboration attribute choreographyRef is not applicable to Choreography */
  choreographyRef: null;
}
