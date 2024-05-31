import { BPMNDefinition, BPMNElement, IdentityOptions, WrappedElement } from '@flowooh/core/types';
import { logger } from '@flowooh/core/utils';

const log = logger('container');

/**
 * It's a container for BPMN definitions
 * The key is the id of the BPMN definition key
 */
export interface DefinitionContainer extends Map<string, BPMNDefinition> {}

/**
 * It's a container for BPMN elements.
 * The first key is the id of the process key
 * The key is the id of the BPMN element key
 */
export interface ElementContainer extends Map<string, Map<string, WrappedElement>> {}

export class Container {
  private static elements: ElementContainer = new Map();
  private static definitions: DefinitionContainer = new Map();

  /**
   * It adds an element to the elements object, if the element has a name property, it will be added with that name
   *
   * @param {string} processId - string - The id of the process
   * @param {WrappedElement} data - element: BPMNElement; key: string
   */
  public static addElement(processId: string, data: WrappedElement) {
    if (!Container.elements.get(processId)) {
      Container.elements.set(processId, new Map());
    }

    const $ = data.element.$;
    Container.elements.get(processId).set($.id, data);

    if ($.name) Container.elements.get(processId).set($.name, data);

    log.info(`Process ${processId} element ${$.id} added to the container`);
  }

  /**
   * If the identity object has an id property, return the element with that id, otherwise if it has a
   * name property, return the element with that name
   *
   * @param {string} processId - The ID of the process.
   * @param {IdentityOptions} identity - IdentityOptions of element
   *
   * @returns The element of the user with the given identity.
   */
  public static getElement<T extends BPMNElement>(processId: string, identity: IdentityOptions) {
    const key = 'id' in identity ? identity.id : identity.name;
    const value = Container.elements.get(processId)?.get(key);

    if (value) log.hit(`Getting process ${processId} element identity ${key}`);
    else log.miss(`Getting process ${processId} element identity ${key}`);

    return value as WrappedElement<T>;
  }

  /**
   * It deletes an element from the elements object
   *
   * @param {string} processId - The ID of the process.
   * @param {IdentityOptions} identity - IdentityOptions of element
   */
  public static delElement(processId: string, identity?: IdentityOptions) {
    if (identity) {
      if ('id' in identity) Container.elements.get(processId)?.delete(identity.id);
      if ('name' in identity) Container.elements.get(processId)?.delete(identity.name);
    } else {
      Container.elements.delete(processId);
      delete Container.elements[processId];
    }

    const key = identity ? ('id' in identity ? identity.id : identity.name) : undefined;
    log.info(`Process ${processId} element identity ${key ?? processId} deleted from the container`);
  }

  /**
   * It adds a new BPMN definition to the definitions object
   *
   * @param {string} id - The id of the BPMN definition.
   * @param {BPMNDefinition} definition - BPMNDefinition
   */
  public static addDefinition(id: string, definition: BPMNDefinition) {
    if (Container.definitions.get(id)) {
      log.warn(`Definition ${id} already exists in the container, it will be overwritten.`);
    }
    Container.definitions.set(id, definition);

    log.info(`Definition ${id} added to the container`);
  }

  /**
   * It returns the definition of the given id
   *
   * @param {string} id - The id of the definition to get.
   *
   * @returns The definition of the id.
   */
  public static getDefinition(id: string) {
    return Container.definitions.get(id);
  }

  /**
   * It deletes the definition of the given id from the definitions object
   *
   * @param {string} id - The id of the definition.
   */
  public static delDefinition(id: string) {
    Container.definitions.delete(id);

    log.info(`Definition ${id} deleted from the container`);
  }
}
