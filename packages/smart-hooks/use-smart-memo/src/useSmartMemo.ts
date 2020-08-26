import { useMemo, useRef } from 'react';

interface MemoStore<T extends unknown> {
  deps?: ReadonlyArray<unknown>;
  value?: T;
}

function useSmartMemo<T extends unknown>(factory: () => T, deps: ReadonlyArray<unknown>): T {
  const memoStore = useRef<MemoStore<T>>({});
  return useMemo<T>(() => {
    const {
      current: { deps: curDeps, value: curValue },
    } = memoStore;

    let gottaRecalculate = curDeps?.length !== deps.length;

    for (let i = 0; !gottaRecalculate && curDeps && i < curDeps.length; i++) {
      gottaRecalculate = !Object.is(curDeps[i], deps[i]);
    }

    if (gottaRecalculate) {
      const evalValue = factory();
      memoStore.current = { deps, value: evalValue };
      return evalValue;
    }

    return curValue as T;
  }, deps);
}

export { useSmartMemo };
