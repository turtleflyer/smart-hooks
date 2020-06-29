import { flagManager } from './testFlags';
import checkRecalculation from './tests/checkRecalculation';
import edgeCases from './tests/edgeCases';
import generalFunctionality from './tests/generalFunctionality';
import { AssetsImport, TestParameter, UseSmartMemoImport } from './testsAssets';

const mainTestSuit = (packagePath: string) =>
  describe.each([
    ['using original useMemo', () => flagManager.set({ MOCK_USE_MEMO: false }), 'original'],
    ['using mocked useMemo', () => flagManager.set({ MOCK_USE_MEMO: true }), 'mocked'],
  ])('Test useSmartMemo correctness (%s)', (_name, setMock, proofOfMock) => {
    const testParameter: TestParameter = {} as TestParameter;

    beforeAll(() => {
      flagManager.set({ PROOF_OF_MOCK: '' });
    });

    beforeEach(() => {
      setMock();
      jest.isolateModules(() => {
        const assets = require('./testsAssets') as AssetsImport;
        const useSmartMemoImport = require(packagePath) as UseSmartMemoImport;
        testParameter.assets = { ...assets, ...useSmartMemoImport };
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
