import { IdentityOptions } from '@flowooh/core/types';

/**
 * any workflow class must extend this class
 */
export abstract class Workflow {
  readonly $__metadata__?: Metadata;
}

export type Metadata = {
  process: IdentityOptions;
  definition: { id: string };
};
