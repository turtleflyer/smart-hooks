/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { cleanup } from '@testing-library/react';
import testFunctionInitialization from './tests/testFunctionInitialization';
import testSetterImmutability from './tests/testSetterImmutability';
import testSophisticatedCase from './tests/testSophisticatedCase';
import { AssetsImport, TestParameter, UseMultiStateImport } from './testsAssets';

const mainTestSuit = (packagePath: string): void =>
  describe('Test useMultiState correctness', () => {
    const testParameter: TestParameter = {} as TestParameter;

    beforeEach(() => {
      jest.isolateModules(() => {
        const assets = require('./testsAssets') as AssetsImport;
        const useMultiStateImport = require(packagePath) as UseMultiStateImport;
        testParameter.assets = { ...assets, ...useMultiStateImport };
      });
    });

    afterEach(cleanup);

    test(...testSetterImmutability(testParameter));
    test(...testSophisticatedCase(testParameter));
    test(...testFunctionInitialization(testParameter));
  });

export default mainTestSuit;
