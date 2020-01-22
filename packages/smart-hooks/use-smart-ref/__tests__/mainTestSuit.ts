import refBindingUpdate from './tests/refBindingUpdate';
import { AssetsImport, UseSmartRefImport, TestParameter } from './testsAssets';
import cleaningAfterUnmount from './tests/cleaningAfterUnmount';
import testOmittingOptionalAPI from './tests/testOmittingOptionalAPI';
import typeParameter from './tests/typeParameter';

const mainTestSuit = (packagePath: string) =>
  describe('Test useSmartRef correctness', () => {
    const testParameter: TestParameter = {} as TestParameter;

    beforeEach(() => {
      jest.isolateModules(() => {
        const { executionCountersFactory } = require('./testsAssets') as AssetsImport;
        const { useSmartRef } = require(packagePath) as UseSmartRefImport;
        testParameter.assets = { executionCountersFactory, useSmartRef };
      });
    });
    test(...refBindingUpdate(testParameter));
    test(...cleaningAfterUnmount(testParameter));
    test(...testOmittingOptionalAPI(testParameter));
    test(...typeParameter(testParameter));
  });

export default mainTestSuit;
