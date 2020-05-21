import mainTestSuit from '../mainTestSuit';
import { flagManager } from '../testFlags';

flagManager.set('SHOULD_TEST_PERFORMANCE', true);

mainTestSuit('../src/useInterstate.tsx');
