import { Knex } from 'knex';
import { BaseData } from '../base/base';

declare module 'knex/types/tables' {
  interface FlowoohDefinitionContentData extends BaseData {
    /** id of workflow definition */
    definition_id: string;

    /** version of workflow definition */
    version: string;

    /** if published */
    published: boolean;

    /** the content of definition, a xml string */
    content: string;
  }
}
