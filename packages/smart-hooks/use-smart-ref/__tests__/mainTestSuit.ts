import refBindingUpdate from './tests/refBindingUpdate';
import { AssetsImport, UseSmartRefImport, TestParameter } from './testsAssets';
import cleaningAfterUnmount from './tests/cleaningAfterUnmount';
import testOmittingOptionalAPI from './tests/testOmittingOptionalAPI';
import typeParameter from './tests/typeParameter';
import { flagManager } from './testFlags';

const mainTestSuit = (packagePath: string) =>
  describe.each([
    [
      'using original useMemo',
      () => flagManager.set('MOCK_USE_MEMO', false),
      'original',
    ],
    [
      'using mocked useMemo',
      () => flagManager.set('MOCK_USE_MEMO', true),
      'mocked',
    ],
  ])('Test useSmartRef correctness (%s)', (name, setMock, proofOfMock) => {
    const testParameter: TestParameter = {} as TestParameter;

    beforeAll(() => {
      flagManager.set('PROOF_OF_MOCK', '');
    });

    beforeEach(() => {
      setMock();
      jest.isolateModules(() => {
        const {
          executionCountersFactory,
        } = require('./testsAssets') as AssetsImport;
        const { useSmartRef } = require(packagePath) as UseSmartRefImport;
        testParameter.assets = { executionCountersFactory, useSmartRef };
      });
    });
    test(...refBindingUpdate(testParameter));
    test(...cleaningAfterUnmount(testParameter));
    test(...testOmittingOptionalAPI(testParameter));
    test(...typeParameter(testParameter));

    test('proof of mock', () => {
      expect(flagManager.read('PROOF_OF_MOCK')).toBe(proofOfMock);
    });
  });

export default mainTestSuit;
