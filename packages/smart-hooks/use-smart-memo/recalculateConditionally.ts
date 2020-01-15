import { useRef } from 'react';

interface MemoStore<T> {
  deps?: ReadonlyArray<any>;
  memValue?: T;
}

function useMaintainMemoStore<T>() {
  return useRef<MemoStore<T>>({}).current;
}

function recalculateConditionally<T>(
  factory: () => T,
  deps: ReadonlyArray<any>,
  store: MemoStore<T>,
) {
  const { deps: prevDeps } = store;
  let gottaRecalculate = !prevDeps || prevDeps.length !== deps.length;
  for (
    let i = 0;
    !gottaRecalculate && i < (prevDeps as ReadonlyArray<any>).length;
    i++
  ) {
    const d = (prevDeps as ReadonlyArray<any>)[i];
    gottaRecalculate = !Object.is((prevDeps as ReadonlyArray<any>)[i], deps[i]);
  }

  if (gottaRecalculate) {
    const memValue = factory();
    Object.assign(store, { deps, memValue });
    return memValue;
  }

  return store.memValue as T;
}

export { useMaintainMemoStore, recalculateConditionally };
