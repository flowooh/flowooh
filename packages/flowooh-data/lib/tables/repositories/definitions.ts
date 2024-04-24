import { Knex } from 'knex';
import { BaseData } from '../base/base';

declare module 'knex/types/tables' {
  interface FlowoohDefinitionData extends BaseData {
    /** name of workflow definition */
    name: string;

    /** description of workflow definition */
    description: string;

    /** version of workflow definition */
    version: string;

    /** if published */
    published: boolean;
  }
}
