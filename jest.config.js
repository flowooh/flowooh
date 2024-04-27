/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'docs/coverage',
  coveragePathIgnorePatterns: ['node_modules/', '<rootDir>/packages/*/node_modules/'],
  coverageProvider: 'v8',
  coverageReporters: [],
  workerThreads: true,
  maxWorkers: 1,
  projects: [
    {
      displayName: 'core',
      preset: 'ts-jest',
      transform: {
        '^.+\\.ts?$': 'ts-jest',
      },
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/packages/flowooh-core/jest.setup.js'],
      testMatch: ['<rootDir>/packages/flowooh-core/__tests__/**/*.test.ts'],
      moduleNameMapper: {
        '^@flowooh/core/(.*)$': '<rootDir>/packages/flowooh-core/lib/$1',
        '^@flowooh/data/(.*)$': '<rootDir>/packages/flowooh-data/lib/$1',
      },
    },
    {
      displayName: 'data',
      preset: 'ts-jest',
      transform: {
        '^.+\\.ts?$': 'ts-jest',
      },
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/packages/flowooh-data/jest.setup.js'],
      testMatch: ['<rootDir>/packages/flowooh-data/__tests__/**/*.test.ts'],
      moduleNameMapper: {
        '^@flowooh/core/(.*)$': '<rootDir>/packages/flowooh-core/lib/$1',
        '^@flowooh/data/(.*)$': '<rootDir>/packages/flowooh-data/lib/$1',
      },
    },
  ],
};
