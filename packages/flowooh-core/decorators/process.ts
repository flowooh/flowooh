import { Container } from '@flowooh/core/container';
import { Metadata, Workflow } from '@flowooh/core/engine';
import { BPMNDefinition, IdentityOptions } from '@flowooh/core/types';
import { parse, readFile, uid } from '@flowooh/core/utils';

/**
 * Process can be defined by XML, path or schema.
 * If more than one is provided, the priority is schema > xml > path.
 */
export type ProcessOptions = { schema: BPMNDefinition } | { xml: string } | { path: string };

/**
 * options is an object containing 2 parts: processOptions and identityOptions
 * processOptions is used to define the bpmn definition, it can be defined by XML, path or schema,
 * identityOptions is used to identify the process in the BPMN process.
 * a bpmn definition may have more than one process, so the identityOptions is required.
 */
export function Process(options: Partial<ProcessOptions & IdentityOptions> & { definitionId: string }): Workflow['constructor'] {
  if ('schema' in options) Container.addDefinition(options.definitionId, options.schema!);
  if ('xml' in options) Container.addDefinition(options.definitionId, parse(options.xml!)['bpmn:definitions']);
  if ('path' in options) Container.addDefinition(options.definitionId, parse(readFile(options.path!))['bpmn:definitions']);

  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      $__metadata__: Metadata = {
        definition: { id: options.definitionId },
        process: {
          ...('id' in options ? { id: options.id } : {}),
          ...('name' in options ? { name: options.name } : {}),
        } as Metadata['process'],
      };
    };
  };
}
