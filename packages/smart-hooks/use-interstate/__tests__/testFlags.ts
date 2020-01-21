import { createFlagManager } from '../../../../test_utilities/createFlagManager';

interface TestFlags {
  SHOULD_TEST_PERFORMANCE: boolean;
}

const testFlagsDefault = {
  SHOULD_TEST_PERFORMANCE: true,
};

const testFlags = {} as TestFlags;

const flagManager = createFlagManager(testFlags, testFlagsDefault);

flagManager.reset();

export { flagManager };
