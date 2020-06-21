import { useEffect, useRef, useCallback } from 'react';

export type SmartRefEffect<T extends HTMLElement> = (el: T) => (() => void) | undefined | void;
type CallbackRef<T extends HTMLElement = HTMLElement> = (el: T | null) => void;

interface Store<T extends HTMLElement> {
  cleanUp?: () => void;
  element?: T | null;
  effect: SmartRefEffect<T>;
}

export function useSmartRef<T extends HTMLElement = HTMLElement>(
  effect: SmartRefEffect<T>,
  ref?: React.MutableRefObject<T | null | undefined>
) {
  const memStore = useRef<Store<T>>({ effect });
  memStore.current = { ...memStore.current, effect };

  function cleanIfDefined() {
    const {
      current: curStore,
      current: { cleanUp },
    } = memStore;
    cleanUp?.();
    memStore.current = { ...curStore, cleanUp: undefined };
  }

  /**
   * If at the moment useEffect being executed store.element stores null then that means the element
   * with "ref={refCallback}" expression has been unmounted and cleaning executes
   */
  useEffect(() => {
    if (!memStore.current.element) {
      cleanIfDefined();
    }
  });

  useEffect(
    () => () => {
      cleanIfDefined();
    },
    []
  );

  const callbackRef = useCallback<CallbackRef<T>>((element) => {
    const {
      current: curStore,
      current: { effect, cleanUp: curCleanUp },
    } = memStore;

    if (ref) {
      ref.current = element;
    }

    let cleanUp = curCleanUp;

    if (element) {
      cleanIfDefined();
      cleanUp = effect(element) as (() => void) | undefined;
    }

    memStore.current = { ...curStore, element, cleanUp };
  }, []);

  return callbackRef;
}
