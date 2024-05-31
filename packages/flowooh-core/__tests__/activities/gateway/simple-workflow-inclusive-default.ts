import { EventActivity } from '@flowooh/core/activities/event';
import { Context } from '@flowooh/core/context';
import { Act, Ctx, Data, Node, Process, Value } from '@flowooh/core/decorators';
import { Workflow } from '@flowooh/core/engine';

@Process({ definitionId: 'simple-workflow-inclusive-default', name: 'simple-workflow-inclusive-default' })
export class SimpleWorkflowInclusiveDefault extends Workflow {
  @Node({ name: 'Start' })
  public start(@Act() activity: EventActivity, @Ctx() context: Context, @Data() data: any, @Value() value: any) {
    activity.takeOutgoing();
  }
}
