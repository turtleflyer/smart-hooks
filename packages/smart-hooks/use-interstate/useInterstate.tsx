// tslint:disable: ban-types

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

type InterstateParam<T> = Exclude<T, Function> | ((oldV: T) => T);
type InitializeParam<T> = Exclude<InterstateParam<T>, undefined | ((oldV: T) => T)> | (() => T);

type SetInterstate<T> = (p: InterstateParam<T>) => void;

function isFunction(p: any): p is Function {
  return typeof p === 'function';
}

function factoryOfSetInterstate<T, K extends MapKey>(stateKey: K, store: Store): SetInterstate<T> {
  return valueToSet => {
    const entry = store.get(stateKey);
    const value = entry.value as T;
    const setters = entry.setters;
    const newActualValue = isFunction(valueToSet) ? valueToSet(value) : valueToSet;

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
}

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

function useSubscribe<T, K extends MapKey>(stateKey: K): T {
  const [, set] = useState<boolean>(true);
  const store = useStore();

  useMemo(() => addSetterToMap(store, stateKey, set), [stateKey]);

  useEffect(() => () => removeSetterFromMap(store, stateKey, set), [stateKey]);

  return store.get(stateKey).value;
}

// Initializing usInterstate without init value (or
// undefined value) preserves the last recorded value. If it
// is needed to set value to undefined on the stage of
// initializing then pass the function parameter () => undefined;
function setInterstateConditional<T>(
  setInterstate: SetInterstate<T>,
  initialValue?: InitializeParam<T>,
) {
  if (initialValue !== undefined) {
    setInterstate(initialValue);
  }
}

function useSetInterstate<T, K extends MapKey = MapKey>(
  stateKey: K,
  initialValue?: InitializeParam<T>,
) {
  const store = useStore();
  const setInterstate = useMemo(() => factoryOfSetInterstate<T, K>(stateKey, store), [stateKey]);

  useMemo(() => setInterstateConditional(setInterstate, initialValue), [stateKey]);

  return setInterstate;
}

function useSubscribeInterstate<T, K extends MapKey = MapKey>(
  stateKey: K,
  initialValue?: InitializeParam<T>,
) {
  useSetInterstate<T, K>(stateKey, initialValue);
  return useSubscribe<T, K>(stateKey);
}

function useInterstate<T, K extends MapKey = MapKey>(
  stateKey: K,
  initialValue?: InitializeParam<T>,
): [() => T, SetInterstate<T>] {
  const setInterstate = useSetInterstate<T, K>(stateKey, initialValue);
  const useSubscribeInterstateDynamic = () => useSubscribe<T, K>(stateKey);
  return [useSubscribeInterstateDynamic, setInterstate];
}

export {
  useInterstate,
  useSubscribeInterstate,
  useSetInterstate,
  MapKey as StateKey,
  Scope,
  InterstateParam,
  InitializeParam,
  SetInterstate,
};
