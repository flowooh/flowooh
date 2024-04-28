import { BPMNDefinition, DefinitionContainer, ElementContainer, IdentityOptions, WrappedElement } from '@flowooh/core/types';
import { logger } from '@flowooh/core/utils';

const log = logger('container');

export class Container {
  private static elements: ElementContainer = {};
  private static definitions: DefinitionContainer = {};

  /**
   * It adds an element to the elements object
   *
   * @param {string} id - string - The id of the process
   * @param {WrappedElement} data - element: BPMNElement; key: string
   */
  public static addElement(id: string, data: WrappedElement) {
    Container.elements[id] = Container.elements[id] ?? {};

    const $ = data.element.$;
    Container.elements[id][$.id] = data;

    if ($.name) Container.elements[id][$.name] = data;

    log.info(`Process ${id} element ${$.id} added to the container`);
  }

  /**
   * If the identity object has an id property, return the element with that id, otherwise if it has a
   * name property, return the element with that name
   *
   * @param {string} id - The ID of the process.
   * @param {IdentityOptions} identity - IdentityOptions of element
   *
   * @returns The element of the user with the given identity.
   */
  public static getElement(id: string, identity: IdentityOptions) {
    const key = identity.id;
    const value = Container.elements[id]?.[key];

    if (value) log.hit(`Getting process ${id} element identity ${key}`);
    else log.miss(`Getting process ${id} element identity ${key}`);

    return value;
  }

  /**
   * It deletes an element from the elements object
   *
   * @param {string} id - The ID of the process.
   * @param {IdentityOptions} identity - IdentityOptions of element
   */
  public static delElement(id: string, identity?: IdentityOptions) {
    if (identity) {
      if ('id' in identity) delete Container.elements[id]?.[identity.id];
    } else delete Container.elements[id];

    const key = identity?.id;
    log.info(`Process ${id} element identity ${key ?? id} deleted from the container`);
  }

  /**
   * It adds a new BPMN definition to the definitions object
   *
   * @param {string} id - The id of the BPMN definition.
   * @param {BPMNDefinition} definition - BPMNDefinition
   */
  public static addDefinition(id: string, definition: BPMNDefinition) {
    Container.definitions[id] = definition;

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
    return Container.definitions[id];
  }

  /**
   * It deletes the definition of the given id from the definitions object
   *
   * @param {string} id - The id of the definition.
   */
  public static delDefinition(id: string) {
    delete Container.definitions[id];

    log.info(`Definition ${id} deleted from the container`);
  }
}
