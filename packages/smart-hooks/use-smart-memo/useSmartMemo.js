import { useMemo, useRef } from 'react';
function useSmartMemo(factory, deps) {
    const memoStore = useRef({});
    return useMemo(() => {
        const { current: { deps: curDeps, value: curValue }, } = memoStore;
        let gottaRecalculate = curDeps?.length !== deps.length;
        for (let i = 0; !gottaRecalculate && curDeps && i < curDeps.length; i++) {
            gottaRecalculate = !Object.is(curDeps[i], deps[i]);
        }
        if (gottaRecalculate) {
            const evalValue = factory();
            memoStore.current = { deps, value: evalValue };
            return evalValue;
        }
        return curValue;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
export { useSmartMemo };
