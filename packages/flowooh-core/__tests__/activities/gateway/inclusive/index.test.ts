import { Flowooh } from '@flowooh/core/engine';
import { parse, readFile } from '@flowooh/core/utils';
import { SimpleWorkflowInclusive } from './';

/**
 * this workflow has 2 exclusive sequence, G1 -> TaskA/TaskB and G2 -> TaskC/TaskD
 * G1 check variable g1, if it includes A, then TaskA will be executed, and same for B
 * G2 check variable g2, if it includes C, then TaskC will be executed, and same for D
 * G3 is used to merge the tokens from G1, otherwise the flow after G1 will be executed twice
 */
describe('Flowooh Inclusive Gateway', () => {
  const path = `${__dirname}/index.bpmn`;
  const xml = readFile(path);
  beforeEach(() => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();
  });

  it('Inclusive Gateway - A-D', async () => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflowInclusive(),
      schema: parse(xml)['bpmn:definitions'],
      value: { g1: ['A'], g2: ['D'] },
    });

    expect(context.isTerminated()).toBeTruthy();
    expect(context.tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskA', 'G2', 'TaskD', 'End']);
  });

  it('Inclusive Gateway - B-C', async () => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflowInclusive(),
      schema: parse(xml)['bpmn:definitions'],
      value: { g1: ['B'], g2: ['C'] },
    });
    expect(context.isTerminated()).toBeTruthy();
    expect(context.tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskB', 'G2', 'TaskC', 'End']);
  });

  it('Inclusive Gateway - AB-CD', async () => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflowInclusive(),
      schema: parse(xml)['bpmn:definitions'],
      value: { g1: ['A', 'B'], g2: ['C', 'D'] },
    });

    expect(context.isTerminated()).toBeTruthy();
    expect(context.tokens.length === 6).toBeTruthy();

    // when all conditions are met, the order of execution is not guaranteed, sames as parallel gateway
    const tokenStart = context.tokens[0].history.map((h) => h.name);
    expect(tokenStart).toEqual(['Start', 'G1']);

    const tokensFromG1 = context.tokens.slice(1, 3);
    expect(tokensFromG1.map((t) => t.history.map((h) => h.name))).toContainEqual(['TaskA', 'G2']);
    expect(tokensFromG1.map((t) => t.history.map((h) => h.name))).toContainEqual(['TaskB', 'G2']);

    const tokenG2 = context.tokens[3].history.map((h) => h.name);
    expect(tokenG2).toEqual(['G2']);

    const tokensFromG2 = context.tokens.slice(4, 6);
    expect(tokensFromG2.map((t) => t.history.map((h) => h.name))).toContainEqual(['TaskC', 'End']);
    expect(tokensFromG2.map((t) => t.history.map((h) => h.name))).toContainEqual(['TaskD', 'End']);
  });

  it('Inclusive Gateway - Default', async () => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflowInclusive(),
      schema: parse(xml)['bpmn:definitions'],
      value: { g1: 'M', g2: 'M' },
    });
    expect(context.isTerminated()).toBeTruthy();
    expect(context.tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskB', 'G2', 'TaskD', 'End']);
  });
});
