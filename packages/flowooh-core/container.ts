import { BPMNDefinition, DefinitionContainer, ElementContainer, IdentityOptions, WrappedElement } from '@flowooh/core/types';
import { logger } from '@flowooh/core/utils';

const log = logger('container');

export class Container {
  private static elements: ElementContainer = {};
  private static definitions: DefinitionContainer = {};

  /**
   * It adds an element to the elements object, if the element has a name property, it will be added with that name
   *
   * @param {string} processId - string - The id of the process
   * @param {WrappedElement} data - element: BPMNElement; key: string
   */
  public static addElement(processId: string, data: WrappedElement) {
    Container.elements[processId] = Container.elements[processId] ?? {};

    const $ = data.element.$;
    Container.elements[processId][$.id] = data;

    if ($.name) Container.elements[processId][$.name] = data;

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
  public static getElement(processId: string, identity: IdentityOptions) {
    const key = 'id' in identity ? identity.id : identity.name;
    const value = Container.elements[processId]?.[key];

    if (value) log.hit(`Getting process ${processId} element identity ${key}`);
    else log.miss(`Getting process ${processId} element identity ${key}`);

    return value;
  }

  /**
   * It deletes an element from the elements object
   *
   * @param {string} processId - The ID of the process.
   * @param {IdentityOptions} identity - IdentityOptions of element
   */
  public static delElement(processId: string, identity?: IdentityOptions) {
    if (identity) {
      if ('id' in identity) delete Container.elements[processId]?.[identity.id];
      if ('name' in identity) delete Container.elements[processId]?.[identity.name];
    } else {
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
