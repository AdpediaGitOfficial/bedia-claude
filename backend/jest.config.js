/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        // The project tsconfig uses module "NodeNext"; override to CommonJS so
        // Jest (which runs under CommonJS) can load the compiled test modules.
        tsconfig: { module: 'CommonJS' },
      },
    ],
  },
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
};
