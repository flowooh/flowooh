import mime from 'mime';
import { MIMEType } from 'node:util';
import { BaseElement } from '../foundation/baseElement';
import { RootElement } from '../foundation/rootElement';
import { FlowElement } from './flowElement';

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.89010
 */
export abstract class Artifact extends BaseElement {}

/**
 * is used to associate information and artifacts with flow objects.
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.94017
 */
export abstract class Association extends Artifact {
  associationDirection: AssociationDirection;
  sourceRef: BaseElement;
  targetRef: BaseElement;
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.79746
 */
export abstract class Group extends Artifact {
  categoryValueRef: CategoryValue[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.79847
 */
export abstract class Category extends RootElement {
  name: string;
  categoryValue: CategoryValue[];
}

/**
 * @see Category
 */
export abstract class CategoryValue extends BaseElement {
  value: string;
  category: Category;
  categorizedFlowElements: FlowElement[];
}

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.79894
 */
export abstract class TextAnnotation extends Artifact {
  text: string;
  /**
   * This attribute identifies the format of the text. It MUST follow the mime-type format. The default is "text/plain."
   */
  textFormat: string;

  get textFormatMimeType() {
    return new MIMEType(mime.getType(this.textFormat || 'text/plain'));
  }
}

export enum AssociationDirection {
  None = 'none',
  One = 'one',
  Both = 'both',
}
