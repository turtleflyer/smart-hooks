function jestConfigFactory() {
  return {
    verbose: true,
    testRegex: '__tests__/.*\\.test\\.[jt]sx?$',
    testPathIgnorePatterns: ['/node_modules/', '.git'],
    preset: 'ts-jest/presets/js-with-ts',
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.test.json',
      },
    },
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node', 'd.ts'],
    transformIgnorePatterns: ['node_modules/(?!@babel/runtime)'],
  };
}

module.exports = { jestConfigFactory };
