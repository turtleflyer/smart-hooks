import { useMemo } from 'react';
import {
  useMaintainMemoStore,
  recalculateConditionally,
} from './recalculateConditionally';

function useSmartMemo<T>(factory: () => T, deps: ReadonlyArray<any>): T {
  const store = useMaintainMemoStore<T>();
  return useMemo<T>(() => recalculateConditionally(factory, deps, store), deps);
}

export { useSmartMemo };
