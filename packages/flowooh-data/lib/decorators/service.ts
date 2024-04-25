import 'reflect-metadata';
import { injectable, inject, Container } from 'inversify';

export const serviceContainer = new Container();

/**
 * service decorator
 * used to decorator a class as a service
 */
export function Service(key: string) {
  return (target: any) => {
    const t = injectable()(target);
    serviceContainer.bind(key).to(target);
    return t;
  };
}

/**
 * decorator for getting instance
 */
export function Inject(key: string) {
  return inject(key);
}
