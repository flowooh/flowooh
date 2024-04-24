/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'docs/coverage',
  coveragePathIgnorePatterns: ['node_modules/', '/packages/node_modules/'],
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: [],
  testMatch: ['<rootDir>/packages/*/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@flowooh-core/(.*)$': '<rootDir>/packages/flowooh-core/lib/$1',
    '^@flowooh-data/(.*)$': '<rootDir>/packages/flowooh-data/lib/$1',
  },
};
