import { IdentityOptions, Serializable } from '@flowooh/core/types';
import { Status } from './enums';
import { IToken, Token } from './token';

export interface IContext<D = any, SV = any> {
  data?: D;
  status: Status;
  tokens: IToken<SV>[];
}

/**
 * Context is the context of the process, it contains the data and the tokens
 */
export class Context<D = any, SV = any> implements IContext<D, SV>, Serializable<IContext, 'value' | 'data'> {
  public data?: D;
  public tokens: Token<SV>[] = [];
  private _status: Status = Status.Ready;

  constructor(data?: Partial<IContext>) {
    if (data) Object.assign(this, data);
  }

  get status() {
    return this._status;
  }

  pause() {
    this._status = Status.Paused;
    return this;
  }

  running() {
    this._status = Status.Running;
    return this;
  }

  resume(force = false) {
    if (force) this._status = Status.Ready;
    else if (this._status !== Status.Terminated) {
      this._status = Status.Ready;
    }
    return this;
  }

  addToken(token: Token<SV>) {
    this.tokens.push(token);
  }

  getTokens(identity: IdentityOptions) {
    if ('id' in identity) return this.tokens.filter((token) => token.state.ref === identity.id);
    if ('name' in identity) return this.tokens.filter((token) => token.state.name === identity.name);
  }

  getProcessingTokens() {
    const processStatuses = [Status.Ready, Status.Paused, Status.Running];
    return this.tokens.filter((t) => processStatuses.includes(t.status));
  }

  delTokens(identity: IdentityOptions) {
    const tokens = this.getTokens(identity)?.map((t) => t.id);
    if (tokens?.length) this.tokens = this.tokens.filter((t) => !tokens.includes(t.id));
  }

  isReady() {
    return this._status === Status.Ready;
  }

  isFailed() {
    return this._status === Status.Failed;
  }

  isPaused() {
    return this.tokens.filter((t) => !t.locked).every((t) => t.status === Status.Paused);
  }

  isCompleted() {
    return this.tokens.filter((t) => !t.locked).every((t) => t.status === Status.Completed);
  }

  isTerminated() {
    return this.tokens.filter((t) => !t.locked).every((t) => t.status === Status.Terminated);
  }

  isPartiallyTerminated() {
    return this.tokens.filter((t) => !t.locked).some((t) => t.status === Status.Terminated);
  }

  complete() {
    this._status = Status.Completed;
    return this;
  }

  fail() {
    this._status = Status.Failed;
    return this;
  }

  terminate() {
    this._status = Status.Terminated;
    return this;
  }

  next() {
    return this.tokens.find((t) => t.status === Status.Ready)?.state;
  }

  serialize({ data, value } = { data: true, value: true }) {
    return {
      status: this._status,
      ...(data ? { data: this.data } : {}),
      tokens: this.tokens.map((t) => t.serialize({ value })),
    };
  }

  static deserialize<D = any, SV = any>(ctx: IContext<D, SV>) {
    return new Context<D>({
      ...ctx,
      tokens: ctx.tokens.map((t) => Token.deserialize(t)),
    });
  }

  static build<D = any, SV = any>(data?: Partial<IContext<D, SV>>) {
    return new Context<D>(data);
  }
}
