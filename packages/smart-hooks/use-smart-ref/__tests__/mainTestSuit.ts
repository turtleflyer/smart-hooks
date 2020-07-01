import cleaningAfterUnmount from './tests/cleaningAfterUnmount';
import refBindingUpdate from './tests/refBindingUpdate';
import shouldFireOnlyWhenNodeChanges from './tests/shouldFireOnlyWhenNodeChanges';
import testCallbackRefImmutability from './tests/testCallbackRefImmutability';
import testOmittingOptionalAPI from './tests/testOmittingOptionalAPI';
import typeParameter from './tests/typeParameter';
import { AssetsImport, TestParameter, UseSmartRefImport } from './testsAssets';

const mainTestSuit = (packagePath: string) =>
  describe('Test useSmartRef correctness', () => {
    const testParameter: TestParameter = {} as TestParameter;

    beforeEach(() => {
      jest.isolateModules(() => {
        const assets = require('./testsAssets') as AssetsImport;
        const useSmartRefImport = require(packagePath) as UseSmartRefImport;
        testParameter.assets = { ...assets, ...useSmartRefImport };
      });
    });

    test(...refBindingUpdate(testParameter));
    test(...cleaningAfterUnmount(testParameter));
    test(...testOmittingOptionalAPI(testParameter));
    test(...shouldFireOnlyWhenNodeChanges(testParameter));
    test(...typeParameter(testParameter));
    test(...testCallbackRefImmutability(testParameter));
  });

export default mainTestSuit;
