import { Status } from '@flowooh/core';
import flowooh from '@flowooh/data';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller()
export class ExecutionController {
  @Get('/executions/todo')
  async executionPage() {
    const data = await flowooh.service.rt.execution.pageExecutions({
      filters: { statuses: [Status.Paused] },
      pagination: { current: 1, pageSize: 10 },
    });
    return data;
  }

  @Post('/execution/start')
  async start(
    @Body() body: { definitionId: string; options: { value: any; data: any } },
  ) {
    const workflow = (await import('../workflows/simple')).default;
    await flowooh.service.rt.execution.start(body.definitionId, {
      workflow: workflow,
    });
    return;
  }

  @Post('/execution/execute')
  async execute(@Body() body: { executionId: string }) {
    const workflow = (await import('../workflows/simple')).default;
    await flowooh.service.rt.execution.execute(body.executionId, { workflow });
    return;
  }
}
