import { cleanup } from '@testing-library/react';
import { flagManager } from './testFlags';
import checkInitializationConcurrency from './tests/checkInitializationConcurrency';
import checkTypes from './tests/checkTypes';
import dynamicSubscriptionWorks from './tests/dynamicSubscriptionWorks';
import rerenderWithInitValueResetState from './tests/rerenderWithInitValueResetState';
import siblingsCanCommunicate from './tests/siblingsCanCommunicate';
import sophisticatedStructure from './tests/sophisticatedStructure';
import testContext from './tests/testContext';
import testErrorHandling from './tests/testErrorHandling';
import testErrorMethods from './tests/testErrorMethods';
import valuesRemainAfterTreeUnmount from './tests/valuesRemainAfterTreeUnmount';
import { AssetsImport, TestParameter, UseInterstateImport } from './testsAssets';

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
          composeCanListen,
          composeCanUpdate,
          composeCanListenAndUpdate,
          ...restAssets
        } = require('./testsAssets') as AssetsImport;

        const useInterstateImport = require(packagePath) as UseInterstateImport;

        const [CanListen, CanUpdate, CanListenAndUpdate] = [
          composeCanListen,
          composeCanUpdate,
          composeCanListenAndUpdate,
        ].map((c) => c(useInterstateImport.useInterstate));

        testParameter.assets = {
          CanListen,
          CanUpdate,
          CanListenAndUpdate,
          ...restAssets,
          ...useInterstateImport,
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
    test(...testErrorHandling(testParameter));
    test(...testErrorMethods(testParameter));
    test(...checkTypes(testParameter));

    test('proof of mock', () => {
      expect(flagManager.read('PROOF_OF_MOCK')).toBe(proofOfMock);
    });
  });

export default mainTestSuit;
