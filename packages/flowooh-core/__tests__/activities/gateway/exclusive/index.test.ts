import { Flowooh } from '@flowooh/core/engine';
import { parse, readFile } from '@flowooh/core/utils';
import { SimpleWorkflowExclusive } from './';

/**
 * this workflow has 2 exclusive sequence, G1 -> TaskA/TaskB and G2 -> TaskC/TaskD
 * G1 check variable g1, if it is A, then TaskA will be executed, otherwise TaskB will be executed
 * G2 check variable g2, if it is C, then TaskC will be executed, otherwise TaskD will be executed
 */
describe('Flowooh Exclusive Gateway', () => {
  const path = `${__dirname}/index.bpmn`;
  const xml = readFile(path);
  beforeEach(() => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();
  });

  it('Exclusive Gateway - 1', async () => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflowExclusive(),
      schema: parse(xml)['bpmn:definitions'],
      value: { g1: 'A', g2: 'D' },
    });
    expect(context.isTerminated()).toBeTruthy();
    expect(context.tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskA', 'G2', 'TaskD', 'End']);
  });

  it('Exclusive Gateway - 2', async () => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflowExclusive(),
      schema: parse(xml)['bpmn:definitions'],
      value: { g1: 'B', g2: 'C' },
    });
    expect(context.isTerminated()).toBeTruthy();
    expect(context.tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskB', 'G2', 'TaskC', 'End']);
  });

  it('Exclusive Gateway - Default', async () => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflowExclusive(),
      schema: parse(xml)['bpmn:definitions'],
      value: { g1: 'M', g2: 'M' },
    });
    expect(context.isTerminated()).toBeTruthy();
    expect(context.tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskB', 'G2', 'TaskD', 'End']);
  });
});
