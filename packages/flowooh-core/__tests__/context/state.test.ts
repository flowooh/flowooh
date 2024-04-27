import { State, Status } from '@flowooh/core/context';

describe('State', () => {
  it('should create a new state with default values', () => {
    const state = new State();
    expect(state.ref).toBeUndefined();
    expect(state.name).toBeUndefined();
    expect(state.status).toBe(Status.Ready);
    expect(state.value).toBeUndefined();
  });

  it('should create a new state with provided values', () => {
    const ref = 'stateRef';
    const name = 'stateName';
    const status = Status.Ready;
    const value = { foo: 'bar' };

    const state = new State({ ref, name, status, value });

    expect(state.ref).toBe(ref);
    expect(state.name).toBe(name);
    expect(state.status).toBe(status);
    expect(state.value).toBe(value);
  });

  it('should build a new state with provided values', () => {
    const ref = 'stateRef';
    const name = 'stateName';
    const status = Status.Ready;
    const value = { foo: 'bar' };

    const state = State.build(ref, { name, status, value });

    expect(state.ref).toBe(ref);
    expect(state.name).toBe(name);
    expect(state.status).toBe(status);
    expect(state.value).toBe(value);
  });
});
