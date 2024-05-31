import { MethodOptions } from '@flowooh/core/engine';
import { IdentityOptions } from '@flowooh/core/types';
import { NodeKey, ParamKey } from '@flowooh/core/utils';
import { ParamType } from './params';

export function Node(options: IdentityOptions & { pause?: boolean }) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const nodes = Reflect.getOwnMetadata(NodeKey, target, '$__metadata__') ?? {};

    if ('id' in options) nodes[options.id] = { options, propertyName };
    else if ('name' in options) nodes[options.name] = { options, propertyName };

    Reflect.defineMetadata(NodeKey, nodes, target, '$__metadata__');

    const method = descriptor.value;

    descriptor.value = function ({ activity, context, token, data, value }: MethodOptions) {
      const params: { parameterIndex: number; type: ParamType }[] = Reflect.getOwnMetadata(ParamKey, target, propertyName);

      if (params?.length) {
        const args: any[] = [];

        if ('$__metadata__' in (this as any)) {
          for (const param of params) {
            if (param.type === 'activity') args.push(activity);
            else if (param.type === 'data') args.push(data);
            else if (param.type === 'value') args.push(value);
            else if (param.type === 'token') args.push(token);
            else if (param.type === 'context') args.push(context);
            else throw new Error('Arguments type is not supported');
          }
        } else throw new Error('@Process decorator is required');
        return method.call(this, ...args);
      }
    };
  };
}
