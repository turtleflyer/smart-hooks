/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useMemo, useEffect, useState, createContext, useContext,
} from 'react';
import getNewStore from '../../../src/utils/getStore';

const globalStore = getNewStore();

const ScopeContext = createContext();

// eslint-disable-next-line react/prop-types
const ProvideScope = ({ children }) => {
  const isolatedStore = useMemo(() => getNewStore(), []);

  return (
    <ScopeContext.Provider value={{ store: isolatedStore }}>{children}</ScopeContext.Provider>
  );
};

const checkId = (id) => {
  const type = typeof id;
  if (!(type === 'string' || type === 'number' || type === 'symbol')) {
    throw new TypeError('Subscription id type should be number, string, or symbol');
  }
};

const factoryOfSetInterstate = (id, store) => (newValue) => {
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

const useStore = () => {
  const context = useContext(ScopeContext);
  const isolatedStore = context && context.store;

  return isolatedStore || globalStore;
};

const useSubscribe = (id) => {
  const [, set] = useState(true);
  const store = useStore();

  useMemo(() => {
    store.set(id, {
      ...store.get(id),
      setters: [...store.get(id).setters, set],
    });
  }, [id, store]);

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
  useMemo(() => checkId(id), [id]);
  const store = useStore();
  const setInterstate = useMemo(() => factoryOfSetInterstate(id, store), [id, store]);

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
export { ProvideScope, useSubscribeInterstate, useSetInterstate };
