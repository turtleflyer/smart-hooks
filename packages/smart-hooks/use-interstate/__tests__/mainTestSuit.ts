import { cleanup } from '@testing-library/react';
import { flagManager } from './testFlags';
import checkInitializationConcurrency from './tests/checkInitializationConcurrency';
import checkTypesBasic from './tests/checkTypesBasic';
import dynamicSubscriptionWorks from './tests/dynamicSubscriptionWorks';
import rerenderWithInitValueResetState from './tests/rerenderWithInitValueResetState';
import siblingsCanCommunicate from './tests/siblingsCanCommunicate';
import sophisticatedStructure from './tests/sophisticatedStructure';
import testContext from './tests/testContext';
import testErrorHandling from './tests/testErrorHandling';
import testErrorMethods from './tests/testErrorMethods';
import testIndependentMode from './tests/testIndependentMode';
import testSettersImmutability from './tests/testSettersImmutability';
import valuesRemainAfterTreeUnmount from './tests/valuesRemainAfterTreeUnmount';
import { AssetsImport, TestParameter, UseInterstateImport } from './testsAssets';

const mainTestSuit = (packagePath: string) =>
  describe.each([
    [
      'test logic',
      { MOCK_USE_MEMO: false, SHOULD_TEST_PERFORMANCE: false, INDEPENDENT_MODE: false },
      'original',
    ],
    [
      'test performance',
      { MOCK_USE_MEMO: false, SHOULD_TEST_PERFORMANCE: true, INDEPENDENT_MODE: false },
      'original',
    ],
    [
      'use mocked useMemo',
      { MOCK_USE_MEMO: true, SHOULD_TEST_PERFORMANCE: false, INDEPENDENT_MODE: false },
      'mocked',
    ],
    [
      'test in independent mode',
      { MOCK_USE_MEMO: true, SHOULD_TEST_PERFORMANCE: false, INDEPENDENT_MODE: true },
      'mocked',
    ],
  ])('Test useInterstate correctness (%s)', (_name, flags, proofOfMock) => {
    const testParameter: TestParameter = {} as TestParameter;

    beforeAll(() => {
      flagManager.set({ ...flags, PROOF_OF_MOCK: '' });
    });

    beforeEach(() => {
      jest.isolateModules(() => {
        const assetsImport = require('./testsAssets') as AssetsImport;
        const { composeCanListen, composeCanUpdate, composeCanListenAndUpdate } = assetsImport;

        const useInterstateImport = require(packagePath) as UseInterstateImport;
        const useInterstateExport = flagManager.read('INDEPENDENT_MODE')
          ? { ...useInterstateImport, ...useInterstateImport.getUseInterstate() }
          : useInterstateImport;

        const [CanListen, CanUpdate, CanListenAndUpdate] = [
          composeCanListen,
          composeCanUpdate,
          composeCanListenAndUpdate,
        ].map((c) => c(useInterstateExport.useInterstate));

        testParameter.assets = {
          CanListen,
          CanUpdate,
          CanListenAndUpdate,
          ...assetsImport,
          ...useInterstateExport,
        };
      });
    });

    afterEach(cleanup);

    test(...siblingsCanCommunicate(testParameter));
    test(...sophisticatedStructure(testParameter));
    test(...dynamicSubscriptionWorks(testParameter));
    test(...testContext(testParameter));
    test(...testErrorHandling(testParameter));
    test(...testIndependentMode(testParameter));

    if (!flags.SHOULD_TEST_PERFORMANCE) {
      test(...checkInitializationConcurrency(testParameter));
      test(...valuesRemainAfterTreeUnmount(testParameter));
      test(...rerenderWithInitValueResetState(testParameter));
      test(...testErrorMethods(testParameter));
      test(...testSettersImmutability(testParameter));
      test(...checkTypesBasic(testParameter));
    }

    test('proof of mock', () => {
      expect(flagManager.read('PROOF_OF_MOCK')).toBe(proofOfMock);
    });
  });

export default mainTestSuit;
