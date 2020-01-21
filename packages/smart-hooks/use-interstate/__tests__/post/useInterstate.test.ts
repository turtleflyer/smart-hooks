import mainTestSuit from '../mainTestSuit';
import { flagManager } from '../testFlags';

flagManager.set('SHOULD_TEST_PERFORMANCE', false);

mainTestSuit('../dist/use-interstate.cjs.js');
