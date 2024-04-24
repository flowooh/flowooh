import { IdentityOptions, Metadata, ProcessOptions } from '@flowooh-core/types';
import { parse, readFile, uid } from '@flowooh-core/utils';
import { Container } from '@flowooh-core/container';

export function Process(options: Partial<ProcessOptions & IdentityOptions>, id: string = uid()): any {
  if ('schema' in options) Container.addDefinition(id, options.schema!);
  if ('xml' in options) Container.addDefinition(id, parse(options.xml!)['bpmn:definitions']);
  if ('path' in options) Container.addDefinition(id, parse(readFile(options.path!))['bpmn:definitions']);

  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      $__metadata__: Metadata = {
        definition: { id },
        process: {
          ...('id' in options ? { id: options.id } : {}),
          ...('name' in options ? { name: options.name } : {}),
        } as Metadata['process'],
      };
    };
  };
}
