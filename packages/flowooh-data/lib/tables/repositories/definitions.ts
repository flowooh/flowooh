import { BaseData } from '../base/base';

declare module 'knex/types/tables' {
  interface FlowoohRepoDefinitionData extends BaseData {
    /** name of workflow definition */
    name: string;

    /** description of workflow definition */
    description: string;

    /** version of workflow definition */
    version: string;

    /** if published */
    published: boolean;
  }

  interface Tables {
    flowooh_repo_definitions: FlowoohRepoDefinitionData;
  }
}
