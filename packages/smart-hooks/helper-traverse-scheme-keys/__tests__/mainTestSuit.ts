import { cleanup } from '@testing-library/react';
import checkTypes from './tests/checkTypes';
import testHelper from './tests/testHelper';
import { AssetsImport, TestParameter, UseTraverseKeysImport } from './testsAssets';

const mainTestSuit = (packagePath: string) =>
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
    test(...checkTypes(testParameter));
  });

export default mainTestSuit;
