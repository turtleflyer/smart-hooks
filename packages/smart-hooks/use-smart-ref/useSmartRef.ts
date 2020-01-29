import { useEffect, useState, useCallback } from 'react';

type Effect<T extends HTMLElement> = (el: T) => void | (() => void) | undefined;
type RefCallback<T extends HTMLElement> = (el: T | null) => void;

interface Store<T extends HTMLElement> {
  clean?: void | (() => void);
  element: T | null;
  effect: Effect<T>;
}

const useSmartRef = <T extends HTMLElement>(
  effect: Effect<T>,
  ref?: React.MutableRefObject<T | null | undefined>,
) => {
  const [store] = useState({} as Store<T>);
  store.effect = effect;

  function cleanIfDefined() {
    if (typeof store.clean === 'function') {
      store.clean();
      store.clean = undefined;
    }
  }

  /**
   * If at the moment useEffect being executed store.element
   * stores null then that means the element with
   * "ref={refCallback}" expression has been unmounted and
   * cleaning executes
   */
  useEffect(() => {
    if (!store.element) {
      cleanIfDefined();
    }
  });

  useEffect(
    () => () => {
      cleanIfDefined();
    },
    [],
  );

  const refCallback = useCallback<RefCallback<T>>((el: T | null) => {
    store.element = el;
    if (ref) {
      ref.current = el;
    }
    if (el) {
      cleanIfDefined();
      store.clean = store.effect(el);
    }
  }, []);

  return refCallback;
};

export { useSmartRef };
