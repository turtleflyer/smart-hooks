import { executionCountersFactory } from '../../../../test_utilities/executionCounter';
import type {
  TestDescriptionG,
  TestParameterG,
} from '../../../../test_utilities/testDescriptionTypes';
import { wrapWithStrictModeComponent } from '../../../../test_utilities/wrapWithStrictModeComponent';
import { useSmartMemo } from '../src/useSmartMemo';

export interface AssetsImport {
  executionCountersFactory: typeof executionCountersFactory;
  wrapWithStrictModeComponent: typeof wrapWithStrictModeComponent;
}

export interface UseSmartMemoImport {
  useSmartMemo: typeof useSmartMemo;
}

export type TestParameter = TestParameterG<AssetsImport & UseSmartMemoImport>;

export type TestDescription = TestDescriptionG<TestParameter>;

export { executionCountersFactory, wrapWithStrictModeComponent };
