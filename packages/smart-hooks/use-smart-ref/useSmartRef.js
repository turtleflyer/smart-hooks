import { useCallback, useEffect, useRef } from 'react';
export function useSmartRef(effect, ref) {
    const memStore = useRef({ effect });
    memStore.current = { ...memStore.current, effect };
    function cleanUpIfDefined() {
        const { current: curStore, current: { cleanUp }, } = memStore;
        if (cleanUp) {
            cleanUp();
            memStore.current = { ...curStore, cleanUp: undefined };
        }
    }
    /**
     * If at the moment useEffect being executed store.element stores null then that means the element
     * with "ref={refCallback}" expression has been unmounted and cleaning executes
     */
    useEffect(() => {
        if (!memStore.current.element) {
            cleanUpIfDefined();
        }
    });
    useEffect(() => () => {
        cleanUpIfDefined();
    }, []);
    const callbackRef = useCallback((element) => {
        const { current: curStore, current: { effect: curEffect, cleanUp: curCleanUp }, } = memStore;
        if (ref) {
            // eslint-disable-next-line no-param-reassign
            ref.current = element;
        }
        let cleanUp = curCleanUp;
        if (element) {
            cleanUpIfDefined();
            cleanUp = curEffect(element);
        }
        memStore.current = { ...curStore, element, cleanUp };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return callbackRef;
}
