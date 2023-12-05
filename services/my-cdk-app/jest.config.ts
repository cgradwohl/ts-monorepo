/* eslint-disable */
export default {
  displayName: 'my-cdk-app',
  preset: '../../jest.preset.js',
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.app.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  modulePathIgnorePatterns: ['dist', 'cdk.out', 'tmp'],
  coverageDirectory: '../../coverage/apps/my-cdk-app',
};
