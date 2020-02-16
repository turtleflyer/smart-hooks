import { AssetsImport, UseSmartMemoImport, TestParameter } from './testsAssets';
import checkRecalculation from './tests/checkRecalculation';
import generalFunctionality from './tests/generalFunctionality';
import edgeCases from './tests/edgeCases';
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
  ])('Test useSmartMemo correctness (%s)', (name, setMock, proofOfMock) => {
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
        const { useSmartMemo } = require(packagePath) as UseSmartMemoImport;
        testParameter.assets = { executionCountersFactory, useSmartMemo };
      });
    });

    test(...generalFunctionality(testParameter));
    test(...checkRecalculation(testParameter));
    test(...edgeCases(testParameter));

    test('proof of mock', () => {
      expect(flagManager.read('PROOF_OF_MOCK')).toBe(proofOfMock);
    });
  });

export default mainTestSuit;
