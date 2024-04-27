import { Context } from '@flowooh/core/context';
import { Flowooh } from '@flowooh/core/engine';
import { getBPMNProcess, parse, readFile } from '@flowooh/core/utils';
import { SimpleWorkflow } from './simple-workflow';

describe('Flowooh', () => {
  const path = `${__dirname}/simple-workflow.bpmn`;
  const xml = readFile(path);
  const schema = parse(xml);

  it('should return process', () => {
    const process = getBPMNProcess(schema['bpmn:definitions'], { id: 'Process_1igpwhg' });
    expect(process).toBeDefined();
  });

  it('should return workflow by schema', async () => {
    const workflow = Flowooh.build();

    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflow(),
      schema: parse(xml)['bpmn:definitions'],
    });

    expect(context.isPaused()).toBeTruthy();
  });

  it('should return workflow by path', async () => {
    const workflow = Flowooh.build();

    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      path,
      handler: new SimpleWorkflow(),
    });

    expect(context.isPaused()).toBeTruthy();
  });

  it('should return workflow by context deserialized', async () => {
    const workflow = Flowooh.build();

    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      path,
      handler: new SimpleWorkflow(),
    });

    expect(context.isPaused()).toBeTruthy();

    const ctx = context.serialize({ data: false, value: false });

    expect(ctx).toBeDefined();

    const exec = await Flowooh.build({ context: Context.deserialize(ctx) }).execute({
      xml,
      handler: new SimpleWorkflow(),
      node: { id: 'Activity_1r8gmbw' },
    });

    expect(exec.context.isTerminated()).toBeTruthy();
  });

  it('should get expected data', async () => {
    const workflow = Flowooh.build();

    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      path,
      handler: new SimpleWorkflow(),
    });
    expect(context.data.trace).toEqual(['start', 'task01']);
  });

  it('should set data from value', async () => {
    const workflow = Flowooh.build();

    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      path,
      handler: new SimpleWorkflow(),
      value: 'test value',
    });
    expect(context.data.startValue).toEqual('test value');
  });
});
