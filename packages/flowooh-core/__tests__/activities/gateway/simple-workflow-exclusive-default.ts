import { EventActivity } from '@flowooh/core/activities/event';
import { Context } from '@flowooh/core/context';
import { Act, Ctx, Data, Node, Process, Value } from '@flowooh/core/decorators';
import { Workflow } from '@flowooh/core/engine';

@Process({ definitionId: 'simple-workflow-exclusive-default', name: 'simple-workflow-exclusive-default' })
export class SimpleWorkflowExclusiveDefault extends Workflow {
  @Node({ name: 'Start' })
  public start(@Act() activity: EventActivity, @Ctx() context: Context, @Data() data: any, @Value() value: any) {
    activity.takeOutgoing();
  }
}
