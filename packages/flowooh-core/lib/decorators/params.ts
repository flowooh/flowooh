import { ParamKey } from '@flowooh-core/utils';

export type ParamType = 'activity' | 'context' | 'token' | 'data' | 'value';

export function Param(type: ParamType) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const params = Reflect.getOwnMetadata(ParamKey, target, propertyKey) ?? [];
    params.unshift({ parameterIndex, type });
    Reflect.defineMetadata(ParamKey, params, target, propertyKey);
  };
}

export function Act() {
  return Param('activity');
}

export function Ctx() {
  return Param('context');
}

export function Sign() {
  return Param('token');
}

export function Data() {
  return Param('data');
}

export function Value() {
  return Param('value');
}
