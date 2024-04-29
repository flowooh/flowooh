import { debug } from 'debug';

const color = (color: string, text: string) => {
  return `\x1b[${color}${text}\x1b[0m`;
};

export const logger = (namespace: string, prefix = '@flowooh/data') => {
  const log = debug(`${prefix}:${namespace}`);

  return {
    hit: (formatter: string, ...args: unknown[]) => log(color('32m', `[HIT] ${formatter}`), ...args),
    miss: (formatter: string, ...args: unknown[]) => log(color('35m', `[MISS] ${formatter}`), ...args),
    error: (formatter: string, ...args: unknown[]) => log(color('31m', `[ERROR] ${formatter}`), ...args),
    warn: (formatter: string, ...args: unknown[]) => log(color('33m', `[WARNING] ${formatter}`), ...args),
    info: (formatter: string, ...args: unknown[]) => log(color('34m', `[INFO] ${formatter}`), ...args),
    debug: (formatter: string, ...args: unknown[]) => log(color('36m', `[DEBUG] ${formatter}`), ...args),
  };
};
