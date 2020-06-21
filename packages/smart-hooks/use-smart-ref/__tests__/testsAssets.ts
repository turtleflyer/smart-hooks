import { executionCountersFactory } from '../../../../test_utilities/executionCounter';
import { wrapWithStrictModeComponent } from '../../../../test_utilities/wrapWithStrictModeComponent';
import { useSmartRef } from '../src/useSmartRef';

export interface AssetsImport {
  executionCountersFactory: typeof executionCountersFactory;
  wrapWithStrictModeComponent: typeof wrapWithStrictModeComponent;
}

export interface UseSmartRefImport {
  useSmartRef: typeof useSmartRef;
}

export interface TestParameter {
  assets: AssetsImport & UseSmartRefImport;
}

export type TestDescription = (p: TestParameter) => [string, () => void];

export { executionCountersFactory, wrapWithStrictModeComponent };
