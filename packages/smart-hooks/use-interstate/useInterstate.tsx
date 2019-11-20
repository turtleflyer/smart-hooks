import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MapKey, Store, storeFactory } from './storeFactory';

const globalStore = storeFactory();

type ScopeContextValue =
  | {
      store: Store;
    }
  | undefined;

const ScopeContext = createContext<ScopeContextValue>(undefined);

const Scope = ({ children }: { children: React.ReactChild | React.ReactChild[] }) => {
  const isolatedStore = useMemo(() => storeFactory(), []);

  return <ScopeContext.Provider value={{ store: isolatedStore }}>{children}</ScopeContext.Provider>;
};

type SetInterstate = (v: any) => void;

const factoryOfSetInterstate: <K extends MapKey>(stateKey: K, store: Store) => SetInterstate = (
  stateKey,
  store,
) => valueToSet => {
  const { value, setters } = store.get(stateKey);
  const newActualValue = typeof valueToSet === 'function' ? valueToSet(value) : valueToSet;

  if (value !== newActualValue) {
    store.set(stateKey, {
      ...store.get(stateKey),
      value: newActualValue,
    });

    setters.forEach(callback => {
      callback((v: boolean) => !v);
    });
  }
};

function chooseStore(context: ScopeContextValue) {
  const scopedStore = context && context.store;

  return scopedStore || globalStore;
}

function useStore() {
  const context = useContext<ScopeContextValue>(ScopeContext);

  return useMemo(() => chooseStore(context), []);
}

function addSetterToMap<K extends MapKey>(
  store: Store,
  stateKey: K,
  setter: React.Dispatch<React.SetStateAction<boolean>>,
) {
  store.set(stateKey, {
    ...store.get(stateKey),
    setters: [...store.get(stateKey).setters, setter],
  });
}

function removeSetterFromMap<K extends MapKey>(
  store: Store,
  stateKey: K,
  setter: React.Dispatch<React.SetStateAction<boolean>>,
) {
  store.set(stateKey, {
    ...store.get(stateKey),
    setters: store.get(stateKey).setters.filter(s => s !== setter),
  });
}

function useSubscribe<K extends MapKey>(stateKey: K) {
  const [, set] = useState<boolean>(true);
  const store = useStore();

  useMemo(() => addSetterToMap(store, stateKey, set), [stateKey]);

  useEffect(() => () => removeSetterFromMap(store, stateKey, set), [stateKey]);

  return store.get(stateKey).value;
}

function setInterstateConditional(setInterstate: SetInterstate, initialValue: any) {
  if (initialValue !== undefined) {
    setInterstate(initialValue);
  }
}

function useSetInterstate<T, K extends MapKey>(stateKey: K, initialValue?: T) {
  const store = useStore();
  const setInterstate = useMemo(() => factoryOfSetInterstate(stateKey, store), [stateKey]);

  useMemo(() => setInterstateConditional(setInterstate, initialValue), [stateKey]);

  return setInterstate;
}

function useSubscribeInterstate<T, K extends MapKey = MapKey>(stateKey: K, initialValue?: T) {
  useSetInterstate(stateKey, initialValue);
  return useSubscribe(stateKey);
}

type UseSubscribeInterstateDynamic = () => any;

function useInterstate<T, K extends MapKey = MapKey>(
  stateKey: K,
  initialValue?: T,
): [UseSubscribeInterstateDynamic, SetInterstate] {
  const setInterstate = useSetInterstate(stateKey, initialValue);
  const useSubscribeInterstateDynamic = () => useSubscribe(stateKey);
  return [useSubscribeInterstateDynamic, setInterstate];
}

export {
  useInterstate,
  useSubscribeInterstate,
  useSetInterstate,
  MapKey as StateKey,
  Scope,
  UseSubscribeInterstateDynamic,
  SetInterstate,
};
