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

export interface UseMultistateImport {
  useMultiState: typeof useMultiState;
}

export type TestParameter = TestParameterG<AssetsImport & UseMultistateImport>;

export type TestDescription = TestDescriptionG<TestParameter>;

export { executionCountersFactory, wrapWithStrictModeComponent };
