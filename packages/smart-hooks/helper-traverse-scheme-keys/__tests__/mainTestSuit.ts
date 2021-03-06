/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { cleanup } from '@testing-library/react';
import testHelper from './tests/testHelper';
import { AssetsImport, TestParameter, UseTraverseKeysImport } from './testsAssets';

const mainTestSuit = (packagePath: string): void =>
  describe('Test useMultiState correctness', () => {
    const testParameter: TestParameter = {} as TestParameter;

    beforeEach(() => {
      jest.isolateModules(() => {
        const assets = require('./testsAssets') as AssetsImport;
        const useTraverseKeysImport = require(packagePath) as UseTraverseKeysImport;
        testParameter.assets = { ...assets, ...useTraverseKeysImport };
      });
    });

    afterEach(cleanup);

    test(...testHelper(testParameter));
  });

export default mainTestSuit;
