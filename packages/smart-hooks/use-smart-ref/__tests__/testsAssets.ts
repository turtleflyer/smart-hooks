import { executionCountersFactory } from '@~internal/test-utilities/executionCounter';
import type {
  TestDescriptionG,
  TestParameterG,
} from '@~internal/test-utilities/testDescriptionTypes';
import { wrapWithStrictModeComponent } from '@~internal/test-utilities/wrapWithStrictModeComponent';
import { useSmartRef } from '../src/useSmartRef';

export interface AssetsImport {
  executionCountersFactory: typeof executionCountersFactory;
  wrapWithStrictModeComponent: typeof wrapWithStrictModeComponent;
}

export interface UseSmartRefImport {
  useSmartRef: typeof useSmartRef;
}

export type TestParameter = TestParameterG<AssetsImport & UseSmartRefImport>;

export type TestDescription = TestDescriptionG<TestParameter>;

export { executionCountersFactory, wrapWithStrictModeComponent };
