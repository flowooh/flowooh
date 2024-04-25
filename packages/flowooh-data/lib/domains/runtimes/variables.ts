import { Context } from '@flowooh-core/context';
import { BaseService } from '@flowooh-data/base/service';
import { Service } from '@flowooh-data/decorators';
import { FlowoohRtVariableData } from 'knex/types/tables';

@Service('flowoohRtVariableService')
export default class FlowoohRtVariableService extends BaseService {
  /**
   * Save variables to database
   * @param executionId
   * @param context
   */
  async save(executionId: string, context: Context) {
    const exec = await this.service.rt.execution.getExecutionById(executionId);
    if (!exec) throw new Error('Execution not found');

    const obj = context.serialize({ data: true, value: false });
    const records = Object.keys(obj.data).map<Partial<FlowoohRtVariableData>>((key) => {
      const { value, valueType } = this.toValue(obj.data[key]);

      return {
        ...value,
        proc_instance_id: exec.proc_instance_id,
        proc_definition_id: exec.proc_definition_id,
        execution_id: exec.id,
        name: key,
        value_type: valueType,
      };
    });

    await this.k('flowooh_rt_variables').insert(records);
  }

  /**
   * Get variables by execution id
   * @param executionId
   * @returns
   */
  async getVariablesByExecution<T extends Record<string, any>>(executionId: string) {
    const list = await this.k('flowooh_rt_variables').where({ execution_id: executionId });
    const v = list.reduce((acc, cur) => {
      acc[cur.name] = this.fromValue(cur);
      return acc;
    }, {} as Record<string, any>);
    return v as T;
  }

  private fromValue(value: FlowoohRtVariableData) {
    if (value.type === 'string') return value.v_string;
    if (value.type === 'int') return value.v_int;
    if (value.type === 'double') return value.v_double;
    if (value.type === 'boolean') return value.v_boolean;
    if (value.type === 'datetime') return value.v_datetime;
    if (value.type === 'json') return JSON.parse(value.v_json);
  }

  private toValue(raw: any) {
    let valueType: FlowoohRtVariableData['type'];
    const value: Partial<FlowoohRtVariableData> = {};
    if (typeof raw === 'string') {
      valueType = 'string';
      value.v_string = raw;
    } else if (typeof raw === 'number' && Number.isInteger(raw)) {
      valueType = 'int';
      value.v_int = raw;
    } else if (typeof raw === 'number') {
      valueType = 'double';
      value.v_double = raw;
    } else if (typeof raw === 'boolean') {
      valueType = 'boolean';
      value.v_boolean = raw;
    } else if (raw instanceof Date) {
      valueType = 'datetime';
      value.v_datetime = raw as Date;
    } else {
      valueType = 'json';
      value.v_json = JSON.stringify(raw);
    }

    return { value, valueType };
  }
}
