import { cleanup } from '@testing-library/react';
import testSetterImmutability from './tests/testSetterImmutability';
import testSophisticatedCase from './tests/testSophisticatedCase';
import { AssetsImport, TestParameter, UseMultistateImport } from './testsAssets';

const mainTestSuit = (packagePath: string) =>
  describe('Test useMultiState correctness', () => {
    const testParameter: TestParameter = {} as TestParameter;

    beforeEach(() => {
      jest.isolateModules(() => {
        const assets = require('./testsAssets') as AssetsImport;
        const useMultistateImport = require(packagePath) as UseMultistateImport;
        testParameter.assets = { ...assets, ...useMultistateImport };
      });
    });

    afterEach(cleanup);

    test(...testSetterImmutability(testParameter));
    test(...testSophisticatedCase(testParameter));
  });

export default mainTestSuit;
