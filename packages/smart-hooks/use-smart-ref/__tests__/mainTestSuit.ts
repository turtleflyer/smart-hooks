import refBindingUpdate from './tests/refBindingUpdate';
import { CounterT, TestParameter } from './testsAssets';
import { useSmartRef as useSmartRefD } from '../useSmartRef';
import cleaningAfterUnmount from './tests/cleaningAfterUnmount';
import testOmittingOptionalAPI from './tests/testOmittingOptionalAPI';
import typeParameter from './tests/typeParameter';

const mainTestSuit = (packagePath: string) =>
  describe('Test useSmartRef functionality', () => {
    const testParameter: TestParameter = {} as TestParameter;

    beforeEach(() => {
      jest.isolateModules(() => {
        const { Counter } = require('./testsAssets') as { Counter: CounterT };
        const { useSmartRef } = require(packagePath) as { useSmartRef: typeof useSmartRefD };
        testParameter.assets = { Counter, useSmartRef };
      });
    });
    test(...refBindingUpdate(testParameter));
    test(...cleaningAfterUnmount(testParameter));
    test(...testOmittingOptionalAPI(testParameter));
    test(...typeParameter(testParameter));
  });

export default mainTestSuit;
