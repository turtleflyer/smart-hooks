import { useEffect, useMemo } from 'react';

type Effect<T extends HTMLElement | undefined> =
  (el: T | null) => (() => void) | void;

type RefCallback<T extends HTMLElement> = (el: T | null) => void;

type GetRefCallback = <T extends HTMLElement>(
  ref?: React.MutableRefObject<T | undefined | null>,
) => RefCallback<T>;

interface Store<T extends HTMLElement> {
  clean?: (() => void) | void;
  element: T | null;
  effect: Effect<T>;
}

type UseSmartRef = <T extends HTMLElement>(
  effect: Effect<T>,
  ref?: React.MutableRefObject<T | undefined | null>,
) => RefCallback<T>;

const getAssets = (): [Store<any>, () => void, GetRefCallback] => {
  // tslint:disable-next-line: no-object-literal-type-assertion
  const store: Store<any> = {} as Store<any>;

  const conditionalClean = () => {
    if (typeof store.clean === 'function') {
      store.clean();
      store.clean = undefined;
    }
  };

  const getRefCallback: GetRefCallback = (ref) => (el) => {
    store.element = el;
    if (ref) {
      ref.current = el;
    }

    if (el) {
      conditionalClean();
      store.clean = store.effect(el);
    }
  };

  return [store, conditionalClean, getRefCallback];
};

const useSmartRef: UseSmartRef = (effect, ref) => {
  const [store, conditionalClean, getRefCallback] = useMemo(() => getAssets(), []);

  store.effect = effect;

  useEffect(() => {
    if (!store.element) {
      conditionalClean();
    }
  });

  useEffect(
    () => () => {
      conditionalClean();
    },
    [],
  );

  const refCallback = useMemo(() => getRefCallback(ref), []);

  return refCallback;
};

export { useSmartRef };
