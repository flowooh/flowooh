import { State, Status, Token } from '@flowooh/core/context';

describe('Token', () => {
  let token: Token;

  beforeEach(() => {
    token = new Token();
  });

  it('should initialize with a unique id', () => {
    expect(token.id).toBeDefined();
  });

  it('should have an empty history array', () => {
    expect(token.history).toEqual([]);
  });

  it('should be able to push a state to the history', () => {
    const state = new State();
    token.push(state);
    expect(token.history).toContain(state);
  });

  it('should be able to pop the last state from the history', () => {
    const state1 = new State();
    const state2 = new State();
    token.push(state1);
    token.push(state2);
    token.pop();
    expect(token.history).toEqual([state1]);
  });

  it('should be able to pause the token', () => {
    const state = new State();
    token.push(state);
    token.pause();
    expect(token.status).toBe(Status.Paused);
  });

  it('should be able to resume the token', () => {
    const state = new State();
    token.push(state);
    token.pause();
    token.resume(false);
    expect(token.status).toBe(Status.Ready);
  });

  it('should be able to set the status', () => {
    const state = new State();
    token.push(state);
    token.status = Status.Completed;
    expect(token.status).toBe(Status.Completed);
  });

  it('should be able to get the current state', () => {
    const state = new State();
    token.push(state);
    expect(token.state).toBe(state);
  });

  it('should be able to build a token with options', () => {
    const options = {
      parent: 'parentToken',
      locked: true,
      history: [new State()],
    };
    const builtToken = Token.build(options);
    expect(builtToken.parent).toBe(options.parent);
    expect(builtToken.locked).toBe(options.locked);
    expect(builtToken.history).toEqual(options.history);
  });

  it('should be error when set status without state', () => {
    expect(() => {
      token.status = Status.Completed;
    }).toThrow('No state to set status');
  });
});
