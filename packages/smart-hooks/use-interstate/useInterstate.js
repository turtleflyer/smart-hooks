/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  useCallback, useMemo, useEffect, useState,
} from 'react';
import getNewStore from '../../../src/utils/getStore';

const store = getNewStore();

const useSubscribe = (id) => {
  const set = useState(true)[1];

  useMemo(() => {
    store.set(id, {
      ...store.get(id),
      setters: [...store.get(id).setters, set],
    });
  }, [id]);

  useEffect(
    () => () => {
      store.set(id, {
        ...store.get(id),
        setters: store.get(id).setters.filter(s => s !== set),
      });
    },
    [id],
  );

  return store.get(id).value;
};

const useSetInterstateFactory = id => useCallback(
  (newValue) => {
    const { value, setters } = store.get(id);
    const newActualValue = typeof newValue === 'function' ? newValue(value) : newValue;

    if (value !== newActualValue) {
      store.set(id, {
        ...store.get(id),
        value: newActualValue,
      });

      setters.forEach((callback) => {
        callback(v => !v);
      });
    }
  },
  [id],
);

const useSetInterstate = (id, initialValue) => {
  const setInterstate = useSetInterstateFactory(id);

  useMemo(() => {
    if (initialValue !== undefined) {
      setInterstate(initialValue);
    }
  }, [id, initialValue]);

  return setInterstate;
};

const useSubscribeInterstate = (id, initialValue) => {
  useSetInterstate(id, initialValue);
  return useSubscribe(id);
};

const useInterstate = (id, initialValue) => {
  const setInterstate = useSetInterstate(id, initialValue);
  const useSubscribeInterstate = () => useSubscribe(id);
  return useMemo(() => [setInterstate, useSubscribeInterstate], [id]);
};

export default useInterstate;
export { useSubscribeInterstate, useSetInterstate };
