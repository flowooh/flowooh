import * as crypto from 'crypto';

export const uid = (size = 8) => {
  return crypto.randomBytes(size).toString('hex');
};

export const executionRecordId = (processInstId: string, executionId: string) => {
  return `${processInstId}::${executionId}`;
};
