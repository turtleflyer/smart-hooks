import { executionCountersFactory } from '../../../../test_utilities/executionCounter';
import { wrapWithStrictModeComponent } from '../../../../test_utilities/wrapWithStrictModeComponent';
import { useMultiState } from '../src/useMultiState';

export interface AssetsImport {
  executionCountersFactory: typeof executionCountersFactory;
  wrapWithStrictModeComponent: typeof wrapWithStrictModeComponent;
}

export interface UseMultistateImport {
  useMultiState: typeof useMultiState;
}

export interface TestParameter {
  assets: AssetsImport & UseMultistateImport;
}

export type TestDescription = (p: TestParameter) => [string, () => void];

export { executionCountersFactory, wrapWithStrictModeComponent };
