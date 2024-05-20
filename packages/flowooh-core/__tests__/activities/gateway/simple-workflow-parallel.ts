import { EventActivity } from '@flowooh/core/activities/event';
import { Context } from '@flowooh/core/context';
import { Act, Ctx, Data, Node, Process, Value } from '@flowooh/core/decorators';
import { Workflow } from '@flowooh/core/engine';

@Process({ name: 'simple-workflow-parallel' })
export class SimpleWorkflowParallel extends Workflow {
  @Node({ name: 'Start' })
  public start(@Act() activity: EventActivity, @Ctx() context: Context, @Data() data: any, @Value() value: any) {
    activity.takeOutgoing();
  }

  @Node({ name: 'TaskB2' })
  public taskB2(@Act() activity: EventActivity, @Ctx() context: Context, @Data() data: any, @Value() value: any) {
    activity.takeOutgoing();
  }
}
