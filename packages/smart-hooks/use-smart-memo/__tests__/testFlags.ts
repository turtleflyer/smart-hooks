import { createFlagManager } from '../../../../test_utilities/createFlagManager';

interface TestFlags {
  MOCK_USE_MEMO: boolean;
  PROOF_OF_MOCK: string;
}

const testFlagsDefault = {
  MOCK_USE_MEMO: false,
  PROOF_OF_MOCK: '',
};

const testFlags = {} as TestFlags;

const flagManager = createFlagManager(testFlags, testFlagsDefault);

flagManager.reset();

export { flagManager };
