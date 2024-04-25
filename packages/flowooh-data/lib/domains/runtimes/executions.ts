import { Context } from '@flowooh-core/context';
import { Flowooh } from '@flowooh-core/engine/flowooh';
import { Workflow } from '@flowooh-core/engine/workflow';
import { BaseService } from '@flowooh-data/base/service';
import { Service } from '@flowooh-data/decorators';
import { uid } from '@flowooh-data/utils/uid';

@Service('flowoohRtExecutionService')
export default class FlowoohRtExecutionService extends BaseService {
  /**
   * Execute a workflow
   * @param definitionId
   * @param target
   * @returns
   */
  async build(startOptions: { definitionId: string }) {
    const { definitionId } = startOptions;
    const schema = await this.service.repo.definition.getBpmnDefinition(definitionId);
    if (!schema) throw new Error('definition not found');

    const executionId = uid();

    await this.k('flowooh_rt_executions').insert({
      id: executionId,
      proc_definition_id: definitionId,
    });

    return executionId;
  }

  async execute(executionId: string, options: { value?: any; workflow: typeof Workflow }) {
    const { value, workflow } = options;
    if (!workflow) throw new Error('target is required');
    if (!(workflow.prototype instanceof Workflow)) throw new Error('Invalid target, target should be a Workflow');

    const execution = await this.getExecutionById(executionId);
    if (!execution) throw new Error('Execution not found');

    const data = await this.service.rt.variable.getVariablesByExecution(executionId);
    const schema = await this.service.repo.definition.getBpmnDefinition(execution.proc_definition_id);

    const instance = Flowooh.build({
      context: Context.build({ data }),
    });

    const exec = await instance.execute({
      value: value,
      factory: () => new (workflow as any)(),
      schema: schema,
    });

    await this.k('flowooh_rt_executions').update({
      act_id: exec.context.tokens[0].state.ref,
    });
    await this.service.rt.variable.save(executionId, exec.context);
    return exec;
  }

  /**
   * Get execution by id
   * @param executionId
   * @returns
   */
  async getExecutionById(executionId: string) {
    return this.k('flowooh_rt_executions').where({ id: executionId }).first();
  }
}
