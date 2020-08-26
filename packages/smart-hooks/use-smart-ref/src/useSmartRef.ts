import { useCallback, useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';

export type SmartRefEffect<T extends HTMLElement = HTMLElement> = (
  el: T
) => (() => void) | undefined | void;

export type CallbackRef<T extends HTMLElement = HTMLElement> = (el: T | null) => void;

interface Store<T extends HTMLElement> {
  cleanUp?: () => void;
  element?: T | null;
  effect: SmartRefEffect<T>;
}

export function useSmartRef<T extends HTMLElement = HTMLElement>(
  effect: SmartRefEffect<T>,
  ref?: MutableRefObject<T | null | undefined>
): CallbackRef<T> {
  const memStore = useRef<Store<T>>({ effect });
  memStore.current = { ...memStore.current, effect };

  function cleanUpIfDefined() {
    const {
      current: curStore,
      current: { cleanUp },
    } = memStore;

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

  useEffect(
    () => () => {
      cleanUpIfDefined();
    },
    []
  );

  const callbackRef = useCallback<CallbackRef<T>>((element) => {
    const {
      current: curStore,
      current: { effect: curEffect, cleanUp: curCleanUp },
    } = memStore;

    if (ref) {
      // eslint-disable-next-line no-param-reassign
      ref.current = element;
    }

    let cleanUp = curCleanUp;

    if (element) {
      cleanUpIfDefined();
      cleanUp = curEffect(element) as (() => void) | undefined;
    }

    memStore.current = { ...curStore, element, cleanUp };
  }, []);

  return callbackRef;
}
