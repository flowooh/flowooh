import { EventActivity } from '@flowooh-core/activities/event';
import { Context, Token } from '@flowooh-core/context';
import { Process, Node, Act, Param, Ctx, Sign, Data, Value } from '@flowooh-core/decorators';
import { Workflow } from '@flowooh-core/engine';

@Process({ id: 'Process_1igpwhg' })
export class SimpleWorkflow extends Workflow {
  @Node({ id: 'Start' })
  public start(@Act() activity: EventActivity, @Data() data: any, @Value() value: any) {
    activity.takeOutgoing();

    return data && value;
  }

  @Node({ id: 'Activity_0xzkax6' })
  public task01(@Act() activity: EventActivity, @Param('data') data: any, @Ctx() context: Context) {
    activity.takeOutgoing({ pause: true });

    return data && context;
  }

  @Node({ id: 'Activity_1r8gmbw' })
  public task02(@Param('activity') activity: EventActivity) {
    activity.takeOutgoing();
  }

  @Node({ id: 'Event_16a7ub0' })
  public end(@Sign() token: Token) {
    return token;
  }
}
