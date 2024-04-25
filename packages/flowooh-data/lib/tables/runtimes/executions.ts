import { BaseData } from '../base/base';

declare module 'knex/types/tables' {
  interface FlowoohRtExecutionData extends BaseData {
    /** id of workflow instance */
    proc_instance_id: string;

    /** id of workflow definition */
    proc_definition_id: string;

    /** id of current activity */
    act_id: string;
  }

  interface Tables {
    flowooh_rt_executions: FlowoohRtExecutionData;
  }
}
