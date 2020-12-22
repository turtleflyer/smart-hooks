import { executionCountersFactory } from '@~internal/test-utilities/executionCounter';
import type {
  TestDescriptionG,
  TestParameterG,
} from '@~internal/test-utilities/testDescriptionTypes';
import { wrapWithStrictModeComponent } from '@~internal/test-utilities/wrapWithStrictModeComponent';
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
