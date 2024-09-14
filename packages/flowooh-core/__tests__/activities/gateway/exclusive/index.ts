import { EventActivity } from '@flowooh/core/activities/event';
import { Context } from '@flowooh/core/context';
import { Act, Ctx, Data, Node, Process, Value } from '@flowooh/core/decorators';
import { Workflow } from '@flowooh/core/engine';

@Process({ definitionId: 'index', name: 'index' })
export class SimpleWorkflowExclusive extends Workflow {
  @Node({ name: 'Start' })
  public start(@Act() activity: EventActivity, @Ctx() context: Context, @Data() data: any, @Value() value: any) {
    context.data = { ...(data || {}), ...(value || {}) };
    activity.takeOutgoing();
  }
}
