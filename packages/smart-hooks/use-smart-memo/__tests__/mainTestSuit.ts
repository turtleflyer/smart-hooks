import { AssetsImport, UseSmartMemoImport, TestParameter } from './testsAssets';
import checkRecalculation from './tests/checkRecalculation';
import generalFunctionality from './tests/generalFunctionality';

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

    test(...generalFunctionality(testParameter));
    test(...checkRecalculation(testParameter));
  });

export default mainTestSuit;
