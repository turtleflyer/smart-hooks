import { AssetsImport, UseSmartMemoImport, TestParameter } from './testsAssets';
import checkRecalculation from './tests/checkRecalculation';

const mainTestSuit = (packagePath: string) =>
  describe('Test useSmartMemo correctness', () => {
    const testParameter: TestParameter = {} as TestParameter;

    beforeEach(() => {
      jest.isolateModules(() => {
        const {
          executionCountersFactory,
        } = require('./testsAssets') as AssetsImport;
        const { useSmartMemo } = require(packagePath) as UseSmartMemoImport;
        testParameter.assets = { executionCountersFactory, useSmartMemo };
      });
    });

    test(...checkRecalculation(testParameter));
  });

export default mainTestSuit;
