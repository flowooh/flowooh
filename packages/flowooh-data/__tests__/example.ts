import { Act, Context, Ctx, Data, EventActivity, Node, Param, Process, Sign, TaskActivity, Token, Value, Workflow } from '@flowooh/core';

@Process({ definitionId: 'test-flowooh-data', id: 'Process_1igpwhg' })
export class SimpleWorkflow extends Workflow {
  @Node({ id: 'StartEvent_1ogvy0x' })
  public start(@Act() activity: EventActivity, @Ctx() context: Context, @Data() data: any, @Value() value: any) {
    activity.takeOutgoing();

    context.data = { ...(data || {}), trace: [...(data?.trace || []), 'start'] };

    return data && value;
  }

  @Node({ name: 'Task01' })
  public task01(@Act() activity: TaskActivity, @Param('data') data: any, @Ctx() context: Context) {
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
