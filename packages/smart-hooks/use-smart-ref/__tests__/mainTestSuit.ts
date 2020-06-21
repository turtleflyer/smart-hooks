import cleaningAfterUnmount from './tests/cleaningAfterUnmount';
import refBindingUpdate from './tests/refBindingUpdate';
import shouldFireOnlyWhenNodeChanges from './tests/shouldFireOnlyWhenNodeChanges';
import testOmittingOptionalAPI from './tests/testOmittingOptionalAPI';
import typeParameter from './tests/typeParameter';
import { AssetsImport, TestParameter, UseSmartRefImport } from './testsAssets';

const mainTestSuit = (packagePath: string) =>
  describe('Test useSmartRef correctness', () => {
    const testParameter: TestParameter = <TestParameter>{};

    beforeEach(() => {
      jest.isolateModules(() => {
        const assets = <AssetsImport>require('./testsAssets');
        const useSmartRefImport = <UseSmartRefImport>require(packagePath);
        testParameter.assets = { ...assets, ...useSmartRefImport };
      });
    });

    test(...refBindingUpdate(testParameter));
    test(...cleaningAfterUnmount(testParameter));
    test(...testOmittingOptionalAPI(testParameter));
    test(...shouldFireOnlyWhenNodeChanges(testParameter));
    test(...typeParameter(testParameter));
  });

export default mainTestSuit;
