import { useMemo, useRef } from 'react';

interface MemoStore<T> {
  deps?: ReadonlyArray<any>;
  memValue?: T;
}

function useSmartMemo<T>(factory: () => T, deps: ReadonlyArray<any>): T {
  const { current: store } = useRef<MemoStore<T>>({});
  return useMemo<T>(() => {
    const { deps: prevDeps } = store;
    let gottaRecalculate = !prevDeps || prevDeps.length !== deps.length;

    for (
      let i = 0;
      !gottaRecalculate && i < (prevDeps as ReadonlyArray<any>).length;
      i++
    ) {
      gottaRecalculate = !Object.is((prevDeps as any[])[i], deps[i]);
    }

    if (gottaRecalculate) {
      const memValue = factory();
      Object.assign(store, { deps, memValue });
      return memValue;
    }

    return store.memValue as T;
  }, deps);
}

export { useSmartMemo };
