import { Flowooh } from '@flowooh/core/engine';
import { parse, readFile } from '@flowooh/core/utils';
import { SimpleWorkflowParallel } from './simple-workflow-parallel';
import { SimpleWorkflowExclusiveDefault } from './simple-workflow-exclusive-default';
import { SimpleWorkflowExclusiveCondition } from './simple-workflow-exclusive-condition';
import { SimpleWorkflowInclusiveDefault } from './simple-workflow-inclusive-default';
import { SimpleWorkflowInclusiveCondition } from './simple-workflow-inclusive-condition';

describe('Flowooh', () => {
  it('Parallel Gateway - general', async () => {
    const path = `${__dirname}/simple-workflow-parallel.bpmn`;
    const xml = readFile(path);
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflowParallel(),
      schema: parse(xml)['bpmn:definitions'],
    });
    expect(context.isPaused()).toBeTruthy();
    const tokens = context.tokens;
    // There are 2 sequence going to G1, so origin token should be terminated, and 2 new tokens should be created
    expect(tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1']);
    expect(tokens[1].history.map((h) => h.name)).toEqual(['TaskA', 'G2']);
    expect(tokens[2].history.map((h) => h.name)).toEqual(['TaskB', 'TaskB2']);

    // context is paused because of TaskB, the gateway G2 is waiting for TaskB2 to be completed
    const { context: context2 } = await workflow.execute({ context, node: { name: 'TaskB2' } });
    expect(context2.isTerminated()).toBeTruthy();
    const tokens2 = context2.tokens;
    expect(tokens2[2].history.map((h) => h.name)).toEqual(['TaskB', 'TaskB2', 'G2']);
    expect(tokens2[3].history.map((h) => h.name)).toEqual(['G2']);
    expect(tokens2[4].history.map((h) => h.name)).toEqual(['TaskC', 'G3']);
    expect(tokens2[5].history.map((h) => h.name)).toEqual(['TaskD', 'G3']);
    expect(tokens2[6].history.map((h) => h.name)).toEqual(['G3', 'End']);
  });

  it('Exclusive Gateway - default', async () => {
    const path = `${__dirname}/simple-workflow-exclusive-default.bpmn`;
    const xml = readFile(path);
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflowExclusiveDefault(),
      schema: parse(xml)['bpmn:definitions'],
    });
    expect(context.isTerminated()).toBeTruthy();
    const tokens = context.tokens;
    expect(tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskA', 'End']);
  });

  it('Exclusive Gateway - condition', async () => {
    const path = `${__dirname}/simple-workflow-exclusive-condition.bpmn`;
    const xml = readFile(path);
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflowExclusiveCondition(),
      schema: parse(xml)['bpmn:definitions'],
    });
    expect(context.isTerminated()).toBeTruthy();
    const tokens = context.tokens;
    expect(tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskB', 'End']);
  });

  it('Inclusive Gateway - default', async () => {
    const path = `${__dirname}/simple-workflow-inclusive-default.bpmn`;
    const xml = readFile(path);
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflowInclusiveDefault(),
      schema: parse(xml)['bpmn:definitions'],
    });
    expect(context.isTerminated()).toBeTruthy();
    const tokens = context.tokens;
    expect(tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskA', 'End']);
  });

  it('Inclusive Gateway - condition', async () => {
    const path = `${__dirname}/simple-workflow-inclusive-condition.bpmn`;
    const xml = readFile(path);
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflowInclusiveCondition(),
      schema: parse(xml)['bpmn:definitions'],
    });
    expect(context.isTerminated()).toBeTruthy();
    const tokens = context.tokens;
    expect(tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskA', 'End']);
  });
});
