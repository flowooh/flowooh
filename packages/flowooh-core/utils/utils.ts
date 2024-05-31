import { EventActivity, GatewayActivity, TaskActivity } from '@flowooh/core/activities';
import { Activity, Sequence } from '@flowooh/core/base';
import { Container } from '@flowooh/core/container';
import { BPMNDefinition, BPMNElement, BPMNEvent, BPMNGateway, BPMNProcess, BPMNTask, IdentityOptions, WrappedElement } from '@flowooh/core/types';
import * as fs from 'fs';
import { parseString } from 'xml2js';

export const getActivity = (process: BPMNProcess, data?: WrappedElement) => {
  if (!data) return new Activity(process);

  const { key, element } = data;

  if (key?.toLowerCase()?.includes('task')) {
    return TaskActivity.build(element as BPMNTask, process, key);
  }
  if (key?.toLowerCase()?.includes('event')) {
    return EventActivity.build(element as BPMNEvent, process, key);
  }
  if (key?.toLowerCase()?.includes('gateway')) {
    return GatewayActivity.build(element as BPMNGateway, process, key);
  }

  return new Activity(process, element, key);
};

export const getWrappedBPMNElement = <T extends BPMNElement>(process: BPMNProcess, identity: IdentityOptions) => {
  const wrappedElement = Container.getElement<T>(process.$.id, identity);
  if (wrappedElement) return wrappedElement;

  for (const [key, elements] of Object.entries(process)) {
    if (typeof elements === 'object' && Array.isArray(elements)) {
      for (const element of elements) {
        if (!Container.getElement(process.$.id, element.$)) Container.addElement(process.$.id, { key, element });
      }
    }
  }
  return Container.getElement<T>(process.$.id, identity);
};

export const getBPMNProcess = (definition: BPMNDefinition, identity: IdentityOptions) => {
  const processes = definition['bpmn:process'];

  if ('id' in identity) return processes.find((process) => process.$.id === identity.id);
  return processes.find((process) => process.$.name === identity.name);
};

/**
 * It accepts an array of {@link Sequence} object, and returns an array of ${@link Activity} object.
 * If the identity is provided, it will filter the outgoing sequence flow based on the identity.
 */
export const takeOutgoing = (outgoing: Sequence[], identity?: IdentityOptions): Activity[] | undefined => {
  if (identity) {
    if ('id' in identity) return outgoing?.filter((o) => o.targetRef?.id === identity.id).map((o) => o.targetRef!);
    return outgoing?.filter((o) => o.targetRef?.name === identity.name).map((o) => o.targetRef!);
  }
  return outgoing?.map((o) => o.targetRef!);
};

export const readFile = (path: string): string => fs.readFileSync(path, 'utf8');

export const parse = (xml: string) => {
  // replace all `bpmn\d?:` with `bpmn:`, such as bpmn2:xxx, bpmn:xxx
  xml = xml.replace(/bpmn\d?:/g, 'bpmn:');

  let parse;
  parseString(xml, { async: false }, (err, result) => {
    if (err) throw err;
    parse = result;
  });

  if (!parse) throw new Error('Input string is not parsable');

  return parse as { 'bpmn:definitions': BPMNDefinition };
};
