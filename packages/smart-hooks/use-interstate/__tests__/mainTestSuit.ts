import { TestParameter, AssetsImport, UseInterstateImport } from './testsAssets';
import { cleanup } from '@testing-library/react';
import siblingsCanCommunicate from './tests/siblingsCanCommunicate';
import sophisticatedStructure from './tests/sophisticatedStructure';
import checkInitializationConcurrency from './tests/checkInitializationConcurrency';
import valuesRemainAfterTreeUnmount from './tests/valuesRemainAfterTreeUnmount';
import rerenderWithInitValueResetState from './tests/rerenderWithInitValueResetState';
import dynamicSubscriptionWorks from './tests/dynamicSubscriptionWorks';
import testContext from './tests/testContext';
import checkRerenderOptimization from './tests/checkRerenderOptimization';
import testErrorHandling from './tests/testErrorHandling';
import testErrorMethods from './tests/testErrorMethods';
import checkTypes from './tests/checkTypes';
import { flagManager } from './testFlags';

const mainTestSuit = (packagePath: string) =>
  describe.each([
    ['using original useMemo', () => flagManager.set('MOCK_USE_MEMO', false), 'original'],
    ['using mocked useMemo', () => flagManager.set('MOCK_USE_MEMO', true), 'mocked'],
  ])('Test useInterstate correctness (%s)', (n, setMock, proofOfMock) => {
    const testParameter: TestParameter = {} as TestParameter;

    beforeAll(() => {
      flagManager.set('PROOF_OF_MOCK', '');
    });

    beforeEach(() => {
      setMock();
      jest.isolateModules(() => {
        const {
          render,
          settersCounterFactory,
          executionCountersFactory,
          composeCanListen,
          composeCanUpdate,
          composeCanListenAndUpdate,
          createAssertWrapper,
        } = require('./testsAssets') as AssetsImport;

        const {
          useInterstate,
          Scope,
          getUseInterstateErrorMethods,
          isUseInterstateError,
        } = require(packagePath) as UseInterstateImport;

        const [CanListen, CanUpdate, CanListenAndUpdate] = [
          composeCanListen,
          composeCanUpdate,
          composeCanListenAndUpdate,
        ].map((c) => c(useInterstate));

        testParameter.assets = {
          render,
          settersCounterFactory,
          executionCountersFactory,
          CanListen,
          CanUpdate,
          CanListenAndUpdate,
          createAssertWrapper,
          useInterstate,
          Scope,
          getUseInterstateErrorMethods,
          isUseInterstateError,
        };
      });
    });

    afterEach(cleanup);

    test(...siblingsCanCommunicate(testParameter));
    test(...sophisticatedStructure(testParameter));
    test(...checkInitializationConcurrency(testParameter));
    test(...valuesRemainAfterTreeUnmount(testParameter));
    test(...rerenderWithInitValueResetState(testParameter));
    test(...dynamicSubscriptionWorks(testParameter));
    test(...testContext(testParameter));
    test(...checkRerenderOptimization(testParameter));
    test(...testErrorHandling(testParameter));
    test(...testErrorMethods(testParameter));
    test(...checkTypes(testParameter));

    test('proof of mock', () => {
      expect(flagManager.read('PROOF_OF_MOCK')).toBe(proofOfMock);
    });
  });

export default mainTestSuit;
