module.exports = {
  verbose: true,
  testRegex: '__tests__/.*\\.test\\.[jt]sx?$',
  testPathIgnorePatterns: ['/node_modules/', '.git'],
  preset: 'ts-jest/presets/js-with-ts',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node', 'd.ts'],
};
