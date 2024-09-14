import { Flowooh } from '@flowooh/core/engine';
import { parse, readFile } from '@flowooh/core/utils';
import { SimpleWorkflowParallel } from './';

/**
 * this workflow has 2 parallel sequence, G1 -> G2 and G2 -> G3
 * there are 1 + 2 + 1 + 2 + 1 = 7 tokens, every begin/end of PARALLEL sequence will create a new token
 * they would be named as
 * tokenStart,
 * tokenParallel1 containing [TaskA, TaskB],
 * tokenG2,
 * tokenParallel2 containing [TaskC, TaskD],
 * tokenG3.
 */
describe('Flowooh Parallel Gateway', () => {
  it('Parallel Gateway', async () => {
    const path = `${__dirname}/index.bpmn`;
    const xml = readFile(path);
    const workflow = Flowooh.build();
    expect(workflow).toBeDefined();

    // --------
    // step 1
    // --------
    const { context } = await workflow.execute({ factory: () => new SimpleWorkflowParallel(), schema: parse(xml)['bpmn:definitions'] });
    expect(context.isPaused()).toBeTruthy();
    const tokens = context.tokens;
    const tokenStart = tokens[0].history.map((h) => h.name);
    expect(tokenStart).toEqual(['Start', 'G1']);
    // There are 2 sequence from G1, they should be executed in PARALLEL, so the order is not guaranteed
    const tokenParallel1 = tokens.slice(1).map((t) => t.history.map((h) => h.name));
    expect(tokenParallel1).toContainEqual(['TaskA', 'G2']);
    expect(tokenParallel1).toContainEqual(['TaskB', 'TaskB2']);

    // --------
    // step 2
    // --------
    // context is paused because of TaskB2, the gateway G2 is waiting for TaskB2 to be completed
    const { context: nextContext } = await workflow.execute({ context, node: { name: 'TaskB2' } });
    expect(nextContext.isTerminated()).toBeTruthy();
    const nextTokens = nextContext.tokens;

    const nextTokenParallel1 = nextTokens.slice(1).map((t) => t.history.map((h) => h.name));
    expect(nextTokenParallel1).toContainEqual(['TaskA', 'G2']);
    expect(nextTokenParallel1).toContainEqual(['TaskB', 'TaskB2', 'G2']);

    const nextTokenG2 = nextTokens[3].history.map((h) => h.name);
    expect(nextTokenG2).toEqual(['G2']);

    const nextTokenParallel2 = nextTokens.slice(4).map((t) => t.history.map((h) => h.name));
    expect(nextTokenParallel2).toContainEqual(['TaskC', 'G3']);
    expect(nextTokenParallel2).toContainEqual(['TaskD', 'G3']);

    const nextTokenG3 = nextTokens[6].history.map((h) => h.name);
    expect(nextTokenG3).toEqual(['G3', 'End']);
  });
});
