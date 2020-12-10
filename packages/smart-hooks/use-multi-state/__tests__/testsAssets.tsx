import { executionCountersFactory } from '../../../../test_utilities/executionCounter';
import type {
  TestDescriptionG,
  TestParameterG,
} from '../../../../test_utilities/testDescriptionTypes';
import { wrapWithStrictModeComponent } from '../../../../test_utilities/wrapWithStrictModeComponent';
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
