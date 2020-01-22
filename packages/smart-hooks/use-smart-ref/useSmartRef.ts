import { useEffect, useState } from 'react';

type Effect<T extends HTMLElement> = (el: T) => (() => void) | undefined;

interface Store<T extends HTMLElement> {
  clean?: () => void;
  element: T | null;
  effect: Effect<T>;
}

const useSmartRef = <T extends HTMLElement>(
  effect: Effect<T>,
  ref?: React.MutableRefObject<HTMLElement | null>,
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

  const [refCallback] = useState(() => (el: T | null) => {
    store.element = el;
    if (ref) {
      ref.current = el;
    }
    if (el) {
      cleanIfDefined();
      store.clean = store.effect(el);
    }
  });

  return refCallback;
};

export { useSmartRef };
