import type {
  TestDescriptionG,
  TestParameterG,
} from '../../../../test_utilities/testDescriptionTypes';
import { wrapWithStrictModeComponent } from '../../../../test_utilities/wrapWithStrictModeComponent';
import { useTraverseKeys } from '../src/useTraverseKeys';

export interface AssetsImport {
  readonly wrapWithStrictModeComponent: typeof wrapWithStrictModeComponent;
}

export interface UseTraverseKeysImport {
  readonly useTraverseKeys: typeof useTraverseKeys;
}

export type TestParameter = TestParameterG<AssetsImport & UseTraverseKeysImport>;

export type TestDescription = TestDescriptionG<TestParameter>;

export { wrapWithStrictModeComponent };
