import mainTestSuit from '../mainTestSuit';
import { flagManager } from '../testFlags';

flagManager.set({ SHOULD_TEST_IMPLEMENTATION: false });

mainTestSuit('../lib/use-interstate.cjs.js');
