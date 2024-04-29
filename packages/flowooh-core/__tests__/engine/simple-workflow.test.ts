import { EventActivity } from '@flowooh/core/activities/event';
import { Context, Token } from '@flowooh/core/context';
import { Act, Ctx, Data, Node, Param, Process, Sign, Value } from '@flowooh/core/decorators';
import { Workflow } from '@flowooh/core/engine';

@Process({ id: 'Process_1igpwhg' })
export class SimpleWorkflow extends Workflow {
  @Node({ id: 'StartEvent_1ogvy0x' })
  public start(@Act() activity: EventActivity, @Ctx() context: Context, @Data() data: any, @Value() value: any) {
    activity.takeOutgoing();

    context.data = { ...(data || {}), trace: [...(data?.trace || []), 'start'] };
    context.data.startValue = 'test value';

    return data && value;
  }

  @Node({ id: 'Activity_0xzkax6' })
  public task01(@Act() activity: EventActivity, @Param('data') data: any, @Ctx() context: Context) {
    activity.takeOutgoing({ pause: true });

    context.data = { ...(data || {}), trace: [...(data?.trace || []), 'task01'] };

    return data && context;
  }

  @Node({ id: 'Activity_1r8gmbw' })
  public task02(@Param('activity') activity: EventActivity, @Data() data: any, @Ctx() context: Context) {
    context.data = { ...(data || {}), trace: [...(data?.trace || []), 'task02'] };
    activity.takeOutgoing();
  }

  @Node({ id: 'Event_16a7ub0' })
  public end(@Sign() token: Token) {
    return token;
  }
}
