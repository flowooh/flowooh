import { Serializable } from '@flowooh/core/types';
import { Status } from './enums';

export interface IState<V = any> {
  ref: string;
  name?: string;
  status: Status;
  value?: V;
}

export class State<V = any> implements IState<V>, Serializable<IState, 'value'> {
  public value?: V;

  public ref!: string;
  public name?: string;
  public status = Status.Ready;

  constructor(data?: Partial<IState>) {
    if (data) Object.assign(this, data);
  }

  clone({ value } = { value: false }) {
    return State.deserialize(this.serialize({ value }));
  }

  serialize({ value } = { value: true }) {
    return {
      ref: this.ref,
      status: this.status,
      ...(value ? { value: this.value } : {}),
      ...(this.name ? { name: this.name } : {}),
    };
  }

  static deserialize<V = any>(state: IState<V>) {
    return new State<V>({ ...state });
  }

  static build<V = any>(ref: string, options: { name?: string; value?: V; status?: Status }) {
    return new State<V>({ ref, ...options });
  }
}
