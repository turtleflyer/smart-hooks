/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect, useState } from 'react';
import getNewStore from '../../../src/utils/getStore';

const store = getNewStore();

const checkId = (id) => {
  const type = typeof id;
  if (!(type === 'string' || type === 'number' || type === 'symbol')) {
    throw new TypeError('Subscription id type should be number, string, or symbol');
  }
};

const FactoryOfSetInterstate = id => (newValue) => {
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
};

const useSubscribe = (id) => {
  const [, set] = useState(true);

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

const useSetInterstate = (id, initialValue) => {
  checkId(id);
  const setInterstate = useMemo(() => FactoryOfSetInterstate(id), [id]);

  useMemo(() => {
    if (initialValue !== undefined) {
      setInterstate(initialValue);
    }
  }, [id]);

  return setInterstate;
};

const useSubscribeInterstate = (id, initialValue) => {
  useSetInterstate(id, initialValue);
  return useSubscribe(id);
};

const useInterstate = (id, initialValue) => {
  const setInterstate = useSetInterstate(id, initialValue);
  const useSubscribeInterstateDynamic = () => useSubscribe(id);
  return [useSubscribeInterstateDynamic, setInterstate];
};

export default useInterstate;
export { useSubscribeInterstate, useSetInterstate };
