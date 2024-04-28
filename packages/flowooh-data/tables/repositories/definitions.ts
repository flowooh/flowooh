import { BaseData } from '../base/base';

export interface FlowoohRepoDefinitionData extends BaseData {
  /** name of workflow definition */
  name: string;

  /** description of workflow definition */
  description: string;

  /** version of workflow definition */
  version: string;

  /** if published */
  published: boolean;
}

declare module 'knex/types/tables' {
  interface Tables {
    flowooh_repo_definitions: FlowoohRepoDefinitionData;
  }
}
