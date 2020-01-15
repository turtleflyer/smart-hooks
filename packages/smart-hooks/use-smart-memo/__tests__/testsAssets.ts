import { useSmartMemo } from '../useSmartMemo';
import { executionCountersFactory } from '../../../../test_utilities/executionCounter';

interface AssetsImport {
  executionCountersFactory: typeof executionCountersFactory;
}

interface UseSmartMemoImport {
  useSmartMemo: typeof useSmartMemo;
}

interface TestParameter {
  assets: AssetsImport & UseSmartMemoImport;
}

type TestDescription = (p: TestParameter) => [string, () => void];

export {
  executionCountersFactory,
  AssetsImport,
  UseSmartMemoImport,
  TestParameter,
  TestDescription,
};
