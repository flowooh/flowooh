import mime from 'mime';
import { MIMEType } from 'node:util';
import { BaseElement } from './baseElement';

/**
 * Documentation
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.89661
 */
export abstract class Documentation extends BaseElement {
  text: string;
  /**
   * This attribute identifies the format of the text. It MUST follow the mime-type format. The default is "text/plain."
   */
  textFormat: string;

  get textFormatMimeType() {
    return new MIMEType(mime.getType(this.textFormat || 'text/plain'));
  }
}
