import { Status } from '@flowooh/core';
import { BaseData } from '../base/base';

export interface FlowoohRtExecutionData extends BaseData {
  /** id of workflow instance */
  proc_instance_id: string;

  /** id of workflow definition */
  proc_definition_id: string;

  /** id of parent execution */
  parent_id: string;

  /** id of execution in certain process instance */
  execution_id: string;

  /** status */
  status: Status;

  /** id of current activity */
  act_id: string;
}

declare module 'knex/types/tables' {
  interface Tables {
    flowooh_rt_executions: FlowoohRtExecutionData;
  }
}
