import { Activity } from '@flowooh-core/base';
import { Context, Token } from '@flowooh-core/context';

export type MethodOptions<D = any, V = any> = {
  activity: Activity;
  context: Context<D, V>;
  token: Token<V>;
  data?: D;
  value?: V;
};
