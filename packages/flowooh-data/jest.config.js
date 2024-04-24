/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'docs/coverage',
  coveragePathIgnorePatterns: ['node_modules/', '/packages/node_modules/'],
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  coverageReporters: [],
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@flowooh-data/(.*)$': '<rootDir>/lib/$1',
    '^@flowooh-core/(.*)$': '<rootDir>/../flowooh-core/lib/$1',
  },
};
