import { BaseData } from '../base/base';

export interface FlowoohRepoDefinitionContentData extends BaseData {
  /** id of workflow definition */
  definition_id: string;

  /** version of workflow definition */
  version: string;

  /** if published */
  published: boolean;

  /** the content of definition, a xml string */
  content: string;
}

declare module 'knex/types/tables' {
  interface Tables {
    flowooh_repo_definition_contents: FlowoohRepoDefinitionContentData;
  }
}
