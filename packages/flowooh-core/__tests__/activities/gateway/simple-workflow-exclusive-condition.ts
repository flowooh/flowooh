import { EventActivity } from '@flowooh/core/activities/event';
import { Context } from '@flowooh/core/context';
import { Act, Ctx, Data, Node, Process, Value } from '@flowooh/core/decorators';
import { Workflow } from '@flowooh/core/engine';

@Process({ definitionId: 'simple-workflow-exclusive-condition', name: 'simple-workflow-exclusive-condition' })
export class SimpleWorkflowExclusiveCondition extends Workflow {
  @Node({ id: 'StartEvent_1ogvy0x', name: 'Start' })
  public start(@Act() activity: EventActivity, @Ctx() context: Context, @Data() data: any, @Value() value: any) {
    context.data = { ...(data || {}), exclusiveCondition: 'B' };
    activity.takeOutgoing();
  }
}
