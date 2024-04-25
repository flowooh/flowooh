import { BaseData } from '../base/base';

declare module 'knex/types/tables' {
  interface FlowoohRtVariableData extends BaseData {
    /** id of workflow instance */
    proc_instance_id: string;

    /** id of workflow definition */
    proc_definition_id: string;

    /** id of related execution */
    execution_id: string;

    /** type of variable */
    type: 'string' | 'int' | 'double' | 'boolean' | 'datetime' | 'json';

    /** name of variable */
    name: string;

    /** value if type is string */
    v_string: string;

    /** value if type is int */
    v_int: number;

    /** value if type is double */
    v_double: number;

    /** value if type is boolean */
    v_boolean: boolean;

    /** value if type is datetime */
    v_datetime: Date;

    /** value if type is json */
    v_json: any;
  }

  interface Tables {
    flowooh_rt_variables: FlowoohRtVariableData;
  }
}
