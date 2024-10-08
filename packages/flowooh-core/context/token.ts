import { Serializable } from '@flowooh/core/types';
import { uid } from '@flowooh/core/utils';
import { Status } from './enums';
import { IState, State } from './state';

export interface IToken<SV = any> {
  readonly id: string;
  parent?: string;
  locked?: boolean;
  history: IState<SV>[];
}

/**
 * Token
 *
 * 1. A token will traverse the Sequence Flow and pass through the elements in the Process.
 * 2. A token is a theoretical concept that is used as an aid to define the behavior of a Process tht is being performed.
 * 3. The behavior of Process elements can be defined by describing how they interact with tokens as it "traverses" the structure of the Process.
 *
 * NOTE: A token does not traverse as Message Flow since it is a Message that is passed down a Message Flow.
 */
export class Token<V = any> implements IToken<V>, Serializable<IToken, 'value'> {
  public readonly id = uid();

  public parent?: string;
  private _locked?: boolean;

  public history: State[] = [];

  constructor(data?: Partial<IToken<V>>) {
    if (data) Object.assign(this, data);
  }

  get locked() {
    return this._locked;
  }

  lock() {
    this._locked = true;
    return this;
  }

  push(state: State) {
    this.history.push(state);
    return this;
  }

  pop() {
    return !this._locked && this.history.pop();
  }

  pause() {
    this.status = Status.Paused;
    return this;
  }

  resume(force?: boolean) {
    if (force) this.status = Status.Ready;
    else if (this.status !== Status.Terminated) {
      this.status = Status.Ready;
    }
    return this;
  }

  isReady() {
    return this.status === Status.Ready;
  }

  isPaused() {
    return this.status === Status.Paused;
  }

  set status(status: Status) {
    if (!this.state) throw Error('No state to set status');
    // 如果token终止了，则需要通知对应的网关
    this.state.status = status;
  }

  get status() {
    if (!this.state) return Status.Ready;
    else return this.state.status;
  }

  get state() {
    return this.history[this.history.length - 1];
  }

  serialize({ value } = { value: true }) {
    return {
      id: this.id,
      history: this.history.map((s) => s.serialize({ value })),
      ...(this.parent ? { parent: this.parent } : {}),
      ...(this._locked !== undefined ? { locked: this._locked } : {}),
    };
  }

  static deserialize(token: IToken) {
    return new Token({
      ...token,
      history: token.history.map((s) => State.deserialize(s)),
    });
  }

  static build<SV = any>(options?: Partial<IToken<SV>>) {
    return new Token({ ...options });
  }
}
