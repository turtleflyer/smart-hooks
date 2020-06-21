import { executionCountersFactory } from '../../../../test_utilities/executionCounter';
import { wrapWithStrictModeComponent } from '../../../../test_utilities/wrapWithStrictModeComponent';
import { useSmartMemo } from '../src/useSmartMemo';

export interface AssetsImport {
  executionCountersFactory: typeof executionCountersFactory;
  wrapWithStrictModeComponent: typeof wrapWithStrictModeComponent;
}

export interface UseSmartMemoImport {
  useSmartMemo: typeof useSmartMemo;
}

export interface TestParameter {
  assets: AssetsImport & UseSmartMemoImport;
}

export type TestDescription = (p: TestParameter) => [string, () => void];

export { executionCountersFactory, wrapWithStrictModeComponent };
