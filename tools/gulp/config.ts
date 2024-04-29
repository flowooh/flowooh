import { getDirs } from './util/task-helpers';

// All paths are related to the base dir
export const source = 'packages';
export const samplePath = 'sample';

/**
 * Returns the paths of all packages
 */
export const packagePaths = getDirs(source);
