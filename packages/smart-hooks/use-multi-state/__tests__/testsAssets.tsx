import { executionCountersFactory } from '@~internal/test-utilities/executionCounter';
import type {
  TestDescriptionG,
  TestParameterG,
} from '@~internal/test-utilities/testDescriptionTypes';
import { wrapWithStrictModeComponent } from '@~internal/test-utilities/wrapWithStrictModeComponent';
import { useMultiState } from '../src/useMultiState';

export interface AssetsImport {
  executionCountersFactory: typeof executionCountersFactory;
  wrapWithStrictModeComponent: typeof wrapWithStrictModeComponent;
}

export interface UseMultiStateImport {
  useMultiState: typeof useMultiState;
}

export type TestParameter = TestParameterG<AssetsImport & UseMultiStateImport>;

export type TestDescription = TestDescriptionG<TestParameter>;

export { executionCountersFactory, wrapWithStrictModeComponent };
