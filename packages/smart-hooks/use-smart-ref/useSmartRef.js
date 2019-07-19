/* eslint-disable react-hooks/exhaustive-deps */
import {
  useMemo, useEffect, useCallback, useLayoutEffect,
} from 'react';
import supplyFreshPromise from './supplyFreshPromise';

const useSmartRef = (effect, ref, deps) => {
  const state = useMemo(() => ({}), []);

  const realRef = useMemo(() => {
    if ((Array.isArray(ref) && ref.length > 0) || !(ref || deps)) {
      return {};
    }

    if (Array.isArray(ref)) {
      return null;
    }

    return ref;
  }, []);

  const realDeps = Array.isArray(ref) ? ref : deps;

  const conditionalClean = useCallback(() => {
    if (typeof state.clean === 'function') {
      state.clean();
    }
  }, []);

  const refreshPromise = useCallback(() => {
    let freshPromise;
    [freshPromise, state.resolver] = supplyFreshPromise();
    freshPromise.then((el) => {
      conditionalClean();
      state.clean = state.effect(el);
    });
  }, []);

  if (!state.resolver) {
    refreshPromise();
  }

  useEffect(
    () => () => {
      conditionalClean();
    },
    [],
  );

  useLayoutEffect(() => {
    state.effect = effect;
  }, realDeps);

  const refCallback = useCallback((el) => {
    if (el) {
      state.resolver(el);
      if (realRef) {
        realRef.current = el;
        refreshPromise();
      }
    }
  }, []);

  return refCallback;
};

export default useSmartRef;
