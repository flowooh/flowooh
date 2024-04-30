import * as crypto from 'crypto';

export const genId = async (size = 8) => {
  return crypto.randomBytes(size).toString('hex');
};

export const genIds = async (count: number, size = 8) => {
  let ids: string[] = [];
  for (let i = 0; i < count; i++) {
    ids.push(await genId(size));
  }
  return ids;
};

export const executionRecordId = (processInstId: string, executionId: string) => {
  return `${processInstId}::${executionId}`;
};
