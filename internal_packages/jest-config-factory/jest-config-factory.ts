import type { Config } from '@jest/types';
import type { TsJestGlobalOptions } from 'ts-jest/dist/types';

export type JestConfig = Config.InitialOptions & {
  globals?: Config.ConfigGlobals & { ['ts-jest']: TsJestGlobalOptions };
};

export const jestConfigFactory = (): JestConfig => ({
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/', '.git'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
      isolatedModules: true,
    },
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node', 'd.ts'],
});
