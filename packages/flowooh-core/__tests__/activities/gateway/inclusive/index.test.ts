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

  it('Only 1 Sequence matched in each gateway: Start -> G1 -> TaskA -> G3 -> TaskC -> End', async () => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflowInclusive(),
      schema: parse(xml)['bpmn:definitions'],
      value: { g1: ['A'], g3: ['C'] },
    });

    expect(context.isTerminated()).toBeTruthy();
    expect(context.tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskA', 'G3', 'TaskC', 'End']);
  });

  it('Only 1 Sequence matched in each gateway: Start -> G1 -> TaskA -> G3 -> TaskD -> End', async () => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context } = await workflow.execute({
      factory: () => new SimpleWorkflowInclusive(),
      schema: parse(xml)['bpmn:definitions'],
      value: { g1: ['A'], g3: ['D'] },
    });

    expect(context.isTerminated()).toBeTruthy();
    expect(context.tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskA', 'G3', 'TaskD', 'End']);
  });

  it('Only 1 Sequence matched in each gateway: Start -> G1 -> TaskB -> TaskB1 -> G2 -> TaskB2 -> G3 -> TaskC -> End', async () => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context: processingContext } = await workflow.execute({
      factory: () => new SimpleWorkflowInclusive(),
      schema: parse(xml)['bpmn:definitions'],
      value: { g1: ['B'], g2: ['B2'], g3: ['C'] },
    });

    // TaskB1 is paused because it is a UserTask
    const { context } = await workflow.execute({ context: processingContext, node: { name: 'TaskB1' } });

    expect(context.isTerminated()).toBeTruthy();
    expect(context.tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskB', 'TaskB1', 'G2', 'TaskB2', 'G3', 'TaskC', 'End']);
  });

  it('All Sequences matched', async () => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context: processingContext } = await workflow.execute({
      factory: () => new SimpleWorkflowInclusive(),
      schema: parse(xml)['bpmn:definitions'],
      value: { g1: ['A', 'B'], g2: ['B2', 'B3'], g3: ['C', 'D'] },
    });

    // TaskB1 is paused because it is a UserTask
    const { context } = await workflow.execute({ context: processingContext, node: { name: 'TaskB1' } });
    expect(context.isTerminated()).toBeTruthy();

    expect(context.tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1']);
    expect(context.tokens[1].history.map((h) => h.name)).toEqual(['G1']);
    expect(context.tokens.slice(2, 7).map((t) => t.history.map((h) => h.name))).toContainEqual(['TaskA', 'G3']);
    expect(context.tokens.slice(2, 7).map((t) => t.history.map((h) => h.name))).toContainEqual(['TaskB', 'TaskB1', 'G2']);
    expect(context.tokens.slice(2, 7).map((t) => t.history.map((h) => h.name))).toContainEqual(['TaskB2', 'G3']);
    expect(context.tokens.slice(2, 7).map((t) => t.history.map((h) => h.name))).toContainEqual(['TaskB3', 'G3']);
    expect(context.tokens[7].history.map((h) => h.name)).toEqual(['G3']);
    expect(context.tokens.slice(8, 10).map((t) => t.history.map((h) => h.name))).toContainEqual(['TaskC', 'End']);
    expect(context.tokens.slice(8, 10).map((t) => t.history.map((h) => h.name))).toContainEqual(['TaskD', 'End']);
  });

  it('No Sequence matched in G1 & G3, Gateway use Default Sequences', async () => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    // G1 and G3 have no matched sequence, so the default sequence will be executed
    const { context: processingContext } = await workflow.execute({
      factory: () => new SimpleWorkflowInclusive(),
      schema: parse(xml)['bpmn:definitions'],
      value: { g1: [], g2: ['B3'], g3: [] },
    });

    // TaskB1 is paused because it is a UserTask
    const { context } = await workflow.execute({ context: processingContext, node: { name: 'TaskB1' } });
    expect(context.isTerminated()).toBeTruthy();
    expect(context.tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskB', 'TaskB1', 'G2', 'TaskB3', 'G3', 'TaskD', 'End']);
  });

  it('Token is terminated before and notifies the gateway', async () => {
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    const { context: processingContext } = await workflow.execute({
      factory: () => new SimpleWorkflowInclusive(),
      schema: parse(xml)['bpmn:definitions'],
      value: { g1: ['B'], g2: [], g3: ['C'] },
    });

    // TaskB1 is paused because it is a UserTask
    const { context } = await workflow.execute({ context: processingContext, node: { name: 'TaskB1' } });

    expect(context.isTerminated()).toBeTruthy();
    expect(context.tokens[0].history.map((h) => h.name)).toEqual(['Start', 'G1', 'TaskB', 'TaskB1', 'G2', 'TaskB2', 'G3', 'TaskC', 'End']);
  });
});
