import {
  useMaintainMemoStore,
  recalculateConditionally,
} from '../recalculateConditionally';

function useMemoMocked<T>(
  factory: () => T,
  // tslint:disable-next-line: variable-name
  _deps: ReadonlyArray<any> | undefined,
) {
  return factory();
}

function useSmartMemo<T>(factory: () => T, deps: ReadonlyArray<any>): T {
  const store = useMaintainMemoStore<T>();
  return useMemoMocked<T>(
    () => recalculateConditionally(factory, deps, store),
    deps,
  );
}

export { useSmartMemo };
