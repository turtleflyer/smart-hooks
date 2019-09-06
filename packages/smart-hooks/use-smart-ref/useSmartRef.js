/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect } from 'react';

const getRefAndDeps = (ref, deps) => (Array.isArray(ref) ? [undefined, ref] : [ref, deps]);

const getAssets = () => {
  const store = {};

  const conditionalClean = () => {
    if (typeof store.clean === 'function') {
      store.clean();
      store.clean = null;
    }
  };

  const refreshHandler = () => {
    store.handler = (el) => {
      conditionalClean();
      store.clean = store.effect(el);
    };
  };

  const getRefCallback = actualRef => (el) => {
    store.ref = el;
    if (el) {
      store.handler(el);
      if (actualRef) {
        // eslint-disable-next-line no-param-reassign
        actualRef.current = el;
      }
      refreshHandler();
    }
  };

  refreshHandler();

  return [store, conditionalClean, getRefCallback];
};

const useSmartRef = (effect, ref, deps) => {
  const [actualRef, actualDeps] = useMemo(() => getRefAndDeps(ref, deps), [ref, deps]);

  const [store, conditionalClean, getRefCallback] = useMemo(() => getAssets(store), []);

  useMemo(() => {
    store.effect = effect;
  }, actualDeps);

  useEffect(() => {
    if (!store.ref) {
      conditionalClean();
    }
  });

  useEffect(
    () => () => {
      conditionalClean();
    },
    [],
  );

  const refCallback = useMemo(() => getRefCallback(actualRef), [actualRef]);

  return refCallback;
};

export default useSmartRef;
