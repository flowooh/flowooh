import { Context, State, Status, Token } from '@flowooh/core/context';

describe('Context', () => {
  let context: Context;

  beforeEach(() => {
    context = new Context();
  });

  it('should initialize with default values', () => {
    expect(context.data).toBeUndefined();
    expect(context.tokens).toEqual([]);
    expect(context.status).toBe(Status.Ready);
  });

  it('should add a token to the context', () => {
    const token = new Token();
    context.addToken(token);
    expect(context.tokens).toContain(token);
  });

  it('should get tokens based on identity options', () => {
    const token1 = new Token({ id: 'token1' });
    token1.push(new State({ ref: 'state1' }));
    const token2 = new Token({ id: 'token2' });
    token2.push(new State({ ref: 'state2' }));
    context.addToken(token1);
    context.addToken(token2);

    const tokens = context.getTokens({ id: 'state1' });
    expect(tokens).toEqual([token1]);
  });

  it('should delete tokens based on identity options', () => {
    const token1 = new Token({ id: 'token1' });
    token1.push(new State({ ref: 'state1' }));
    const token2 = new Token({ id: 'token2' });
    token2.push(new State({ ref: 'state2' }));
    context.addToken(token1);
    context.addToken(token2);

    context.delTokens({ id: 'state1' });
    expect(context.tokens).toEqual([token2]);
  });

  it('should check if the context is ready', () => {
    expect(context.isReady()).toBe(true);
  });

  it('should fail the context', () => {
    context.fail();
    expect(context.isFailed()).toBe(true);
  });

  it('should pause the context', () => {
    context.pause();
    expect(context.isPaused()).toBe(true);
  });

  it('should complete the context', () => {
    context.complete();
    expect(context.isCompleted()).toBe(true);
  });

  it('should check if the context is partially terminated', () => {
    // Implement the test case for isPartiallyTerminated() method
  });
  ``;

  it('should terminate the context', () => {
    context.terminate();
    expect(context.isTerminated()).toBe(true);
  });

  it('should move to the next step', () => {
    context.next();
    expect(context.isReady()).toBe(true);
  });

  it('should build a context with partial data', () => {
    const _context = Context.build({ status: Status.Ready });
    expect(_context.status).toBe(Status.Ready);
  });
});
