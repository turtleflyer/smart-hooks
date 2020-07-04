module.exports = {
  verbose: true,
  testRegex: '__tests__/.*\\.test\\.[jt]sx?$',
  testPathIgnorePatterns: ['/node_modules/', '.git'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
};
