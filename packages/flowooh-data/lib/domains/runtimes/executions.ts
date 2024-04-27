import { Context, Flowooh, IToken, Token, Workflow } from '@flowooh/core';
import { BaseService } from '@flowooh/data/base/service';
import { Service } from '@flowooh/data/decorators';
import { executionRecordId } from '@flowooh/data/utils/uid';
import { FlowoohRtExecutionData } from 'knex/types/tables';

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

    const exec = await instance.execute({
      value: value,
      factory: () => new (workflow as any)(),
      schema: schema,
    });

    await this.save(definitionId, exec.process.$.id, exec.context);
    return exec;
  }

  async execute(executionId: string, options: { value?: any; workflow: typeof Workflow }) {
    const { value, workflow } = options;
    if (!workflow) throw new Error('target is required');
    if (!(workflow.prototype instanceof Workflow)) throw new Error('Invalid target, target should be a Workflow');

    const execution = await this.getExecutionById(executionId);
    if (!execution) throw new Error('Execution not found');

    const data = await this.service.rt.variable.getVariablesByExecution(executionId);
    const schema = await this.service.repo.definition.getBpmnDefinition(execution.proc_definition_id);
    const executions = await this.listExecutionsByProcessInstanceId(execution.proc_instance_id);
    const tokens: IToken[] = executions.map((exec) => {
      return Token.build({
        parent: exec.parent_id,
        id: exec.execution_id,
        history: [{ ref: exec.act_id, status: exec.status }],
      });
    });

    const instance = Flowooh.build({ context: new Context({ data, tokens: tokens }) });

    const exec = await instance.execute({
      value: value,
      factory: () => new (workflow as any)(),
      schema: schema,
      node: { id: execution.act_id },
    });

    await this.save(execution.proc_definition_id, exec.process.$.id, exec.context);
    return exec;
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
  }

  /**
   * Get execution by id
   * @param executionId
   * @returns
   */
  async getExecutionById(executionId: string) {
    return this.k('flowooh_rt_executions').where({ id: executionId }).first();
  }

  async listExecutionsByProcessInstanceId(processInstanceId: string) {
    return this.k('flowooh_rt_executions').where({ proc_instance_id: processInstanceId });
  }
}
