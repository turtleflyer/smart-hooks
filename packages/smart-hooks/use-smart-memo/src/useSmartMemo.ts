import { useMemo, useRef } from 'react';

interface MemoStore<T> {
  deps?: ReadonlyArray<any>;
  value?: T;
}

function useSmartMemo<T>(factory: () => T, deps: ReadonlyArray<any>): T {
  const memStore = useRef<MemoStore<T>>({});
  return useMemo<T>(() => {
    const {
      current: { deps: curDeps, value: curValue },
    } = memStore;

    let gottaRecalculate = !curDeps || curDeps.length !== deps.length;

    for (let i = 0; !gottaRecalculate && i < (curDeps as ReadonlyArray<any>).length; i++) {
      gottaRecalculate = !Object.is((curDeps as any[])[i], deps[i]);
    }

    if (gottaRecalculate) {
      const evalValue = factory();
      memStore.current = { deps, value: evalValue };
      return evalValue;
    }

    return curValue as T;
  }, deps);
}

export { useSmartMemo };
