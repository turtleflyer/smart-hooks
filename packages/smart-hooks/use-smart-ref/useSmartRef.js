/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect } from 'react';

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
    if (actualRef) {
      // eslint-disable-next-line no-param-reassign
      actualRef.current = el;
    }

    if (el) {
      store.handler(el);
      refreshHandler();
    }
  };

  refreshHandler();

  return [store, conditionalClean, getRefCallback];
};

const useSmartRef = (effect, ref) => {
  const [store, conditionalClean, getRefCallback] = useMemo(() => getAssets(store), []);

  store.effect = effect;

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

  const refCallback = useMemo(() => getRefCallback(ref), [ref]);

  return refCallback;
};

export { useSmartRef };
