import { Context, Flowooh, IToken, Status, Token, Workflow } from '@flowooh/core';
import { FlowoohRtExecutionData } from '@flowooh/data/tables/runtimes/executions';
import { executionRecordId, genId } from '@flowooh/data/utils/uid';
import { BaseService } from '../base';
import { Service } from '../decorator';

@Service('flowoohRtExecutionService')
export default class FlowoohRtExecutionService extends BaseService {
  /**
   * Execute a workflow
   * @param definitionId
   * @param target
   * @returns
   */
  async start(definitionId: string, options: { value?: any; data?: any; workflow: typeof Workflow }) {
    const { value, workflow } = options;
    if (!workflow) throw new Error('target is required');
    if (!(workflow.prototype instanceof Workflow)) throw new Error('Invalid target, target should be a Workflow');

    const schema = await this.service.repo.definition.getBpmnDefinition(definitionId);
    if (!schema) throw new Error('definition not found');

    const instance = Flowooh.build({ context: Context.build({ data: options.data }) });
    const execution = await instance.execute({
      value: value,
      factory: () => new (workflow as any)(),
      schema: schema,
    });

    const processInstanceId = await genId();
    const executionRecordIds = await this.save(definitionId, processInstanceId, execution.context);
    return { execution, processInstanceId, executionRecordIds };
  }

  async execute(executionId: string, options: { value?: any; workflow: typeof Workflow }) {
    const { value, workflow } = options;
    if (!workflow) throw new Error('target is required');
    if (!(workflow.prototype instanceof Workflow)) throw new Error('Invalid target, target should be a Workflow');

    const originExecution = await this.getExecutionById(executionId);
    if (!originExecution) throw new Error('Execution not found');

    const data = await this.service.rt.variable.getVariablesByExecution(executionId);
    const schema = await this.service.repo.definition.getBpmnDefinition(originExecution.proc_definition_id);
    const executions = await this.listExecutionsByProcessInstanceId(originExecution.proc_instance_id);
    const tokens: IToken[] = executions.map((exec) => {
      return Token.build({
        parent: exec.parent_id,
        id: exec.execution_id,
        history: [{ ref: exec.act_id, status: exec.status }],
      });
    });

    const instance = Flowooh.build({ context: new Context({ data, tokens: tokens }) });

    const execution = await instance.execute({
      value: value,
      factory: () => new (workflow as any)(),
      schema: schema,
      node: { id: originExecution.act_id },
    });

    const executionRecordIds = await this.save(originExecution.proc_definition_id, originExecution.proc_instance_id, execution.context);
    return { execution, processInstanceId: originExecution.proc_instance_id, executionRecordIds };
  }

  async save(processDefId: string, processInstId: string, context: Context) {
    const executionRecords = context.tokens.map<Partial<FlowoohRtExecutionData>>((token) => {
      return {
        id: executionRecordId(processInstId, token.id),
        proc_instance_id: processInstId,
        proc_definition_id: processDefId,
        execution_id: token.id,
        parent_id: token.parent,
        status: token.status,
        act_id: token.state.ref,
      };
    });
    const rootExec = executionRecords.find((exec) => !exec.parent_id);
    if (!rootExec) throw new Error('Root execution not found');

    await this.k('flowooh_rt_executions').delete().where({ proc_instance_id: processInstId });
    await this.k('flowooh_rt_executions').insert(executionRecords);
    await this.service.rt.variable.saveProcessInstanceData(rootExec.id!, context);
    return executionRecords.map((exec) => exec.id);
  }

  /**
   * Get execution by id
   * @param executionId
   * @returns
   */
  async getExecutionById(executionId: string) {
    return this.k('flowooh_rt_executions').where({ id: executionId }).first();
  }

  /**
   * Get executions by page
   * @param options
   * @returns
   */
  async pageExecutions(options: {
    filters: {
      /** process instance id */
      proc_instance_id?: string;
      /** process definition id */
      proc_definition_id?: string;
      /** status */
      statuses?: Status[];
    };
    pagination: {
      /** current page index */
      current?: number;
      /** size of a page */
      pageSize?: number;
    };
  }) {
    let query = this.k('flowooh_rt_executions');
    if (options.filters.proc_instance_id) query = query.where('proc_instance_id', options.filters.proc_instance_id);
    if (options.filters.proc_definition_id) query = query.where('proc_definition_id', options.filters.proc_definition_id);
    if (options.filters.statuses?.length) query = query.whereIn('status', options.filters.statuses);
    const { current = 1, pageSize = 10 } = options.pagination;
    const [list, total] = await Promise.all([
      query
        .clone()
        .offset((current - 1) * pageSize)
        .limit(pageSize),
      query
        .clone()
        .count()
        .first()
        .then((r) => r?.count),
    ]);

    return { total: total || 0, list };
  }

  /**
   * List executions by process instance id
   * @param processInstanceId
   * @returns
   */
  async listExecutionsByProcessInstanceId(processInstanceId: string) {
    return this.k('flowooh_rt_executions').where({ proc_instance_id: processInstanceId });
  }
}
