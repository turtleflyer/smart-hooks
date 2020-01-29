// tslint:disable: ban-types

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { MapKey, Store, storeFactory } from './storeFactory';
import { useSmartMemo } from '@smart-hooks/use-smart-memo';

const globalStore = storeFactory();

type ScopeContextValue =
  | {
      store: Store;
    }
  | undefined;

const ScopeContext = createContext<ScopeContextValue>(undefined);

const Scope = ({
  children,
}: {
  children: React.ReactChild | React.ReactChild[];
}) => {
  const [isolatedStore] = useState(() => storeFactory());

  return (
    <ScopeContext.Provider value={{ store: isolatedStore }}>
      {children}
    </ScopeContext.Provider>
  );
};

type InterstateParam<T> = Exclude<T, Function> | ((oldV: T) => T);
type InitializeParam<T> = Exclude<InterstateParam<T>, undefined>;

type SetInterstate<T> = (p: InterstateParam<T>) => void;

function useStore() {
  const context = useContext<ScopeContextValue>(ScopeContext);

  return useMemo(() => (context && context.store) || globalStore, []);
}

function useSubscribe<T>(stateKey: MapKey): T {
  const [, setter] = useState<boolean>(true);
  const store = useStore();

  useSmartMemo(() => store.addSetter(stateKey, setter), [stateKey]);

  useEffect(() => () => store.removeSetter(stateKey, setter), [stateKey]);

  return store.getValue(stateKey);
}

function isFunction(p: any): p is Function {
  return typeof p === 'function';
}

function useSetInterstate<T>(
  stateKey: MapKey,
  initialValue?: InitializeParam<T>,
) {
  const store = useStore();
  const setInterstate = useCallback<SetInterstate<T>>(
    valueToSet => {
      const value = store.getValue(stateKey) as T;
      const newActualValue = isFunction(valueToSet)
        ? valueToSet(value)
        : valueToSet;

      if (value !== newActualValue) {
        store.setValue(stateKey, newActualValue);
        store.triggerSetters(stateKey);
      }
    },
    [stateKey],
  );

  useSmartMemo(() => {
    store.initEntry(stateKey);

    /** Initializing usInterstate without an init value (or
     * undefined value) preserves the last recorded value.
     * If it is needed to set the value to undefined on the
     * stage of initializing then pass the function
     * parameter () => undefined;
     *
     * useInterstate accepts an initial value being a
     * function that has a parameter which is treated as a
     * current value of the state for the specific key. That
     * is the same way as then the setter takes a function
     * to calculate a new value of the state. (The same
     * manner as a setter returned by useState calculates
     * the new value of the state.)
     *
     */

    if (initialValue !== undefined) {
      setInterstate(initialValue);
    }
  }, [stateKey]);

  return setInterstate;
}

function useSubscribeInterstate<T>(
  stateKey: MapKey,
  initialValue?: InitializeParam<T>,
) {
  useSetInterstate<T>(stateKey, initialValue);
  return useSubscribe<T>(stateKey);
}

function useInterstate<T>(
  stateKey: MapKey,
  initialValue?: InitializeParam<T>,
): [() => T, SetInterstate<T>] {
  const setInterstate = useSetInterstate<T>(stateKey, initialValue);
  const useSubscribeInterstateDynamic = () => useSubscribe<T>(stateKey);
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
