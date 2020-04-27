import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import { MapKey, Store, storeFactory, SettersListEntry } from './storeFactory';
import { useSmartMemo } from '@smart-hooks/use-smart-memo';

function isFunction(p: any): p is Function {
  return typeof p === 'function';
}

const globalStore = storeFactory();

type ScopeContextValue = { store: Store } | undefined;

const ScopeContext = createContext<ScopeContextValue>(undefined);

const Scope: React.FunctionComponent<{
  children: React.ReactChild | React.ReactChild[];
}> = ({ children }) => {
  const [isolatedStore] = useState(() => storeFactory());

  return (
    <ScopeContext.Provider value={{ store: isolatedStore }}>
      {children}
    </ScopeContext.Provider>
  );
};

export type InterstateParam<T> = Exclude<T, Function> | ((oldV: T) => T);
export type InterstateInitializeParam<T> = Exclude<
  InterstateParam<T>,
  undefined
>;

type SetInterstate<T> = (p: InterstateParam<T>) => void;

interface MemState {
  stateKey: MapKey;
  mustTrigger: boolean;
  setterEntry?: SettersListEntry;
}

function useStore(): Store {
  const context = useContext<ScopeContextValue>(ScopeContext);

  return useMemo(() => context?.store || globalStore, []);
}

function getNewValue<T>(valueToSet: InterstateParam<T>, oldValue: T) {
  return isFunction(valueToSet) ? valueToSet(oldValue) : valueToSet;
}

function useInterstate<T>(
  stateKey: MapKey,
  initialValue?: InterstateInitializeParam<T>
): [() => T, SetInterstate<T>] {
  const store = useStore();
  const memState = useRef<MemState>({
    mustTrigger: false,
    stateKey,
  });

  useSmartMemo(() => {
    const { current: currentMemState } = memState;
    let mustTrigger: boolean = false;
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
      const prevValue: T = store.getValue(stateKey);
      const newValue = getNewValue(initialValue, prevValue);

      if (prevValue !== newValue) {
        store.setValue(stateKey, newValue);
        mustTrigger = true;
      }
    }

    memState.current = { ...currentMemState, mustTrigger, stateKey };
  }, [stateKey]);

  useEffect(() => {
    const {
      current: currentMemState,
      current: { mustTrigger, setterEntry },
    } = memState;

    if (mustTrigger) {
      store.triggerSetters(stateKey, setterEntry);
    }

    memState.current = { ...currentMemState, mustTrigger: false };

    return () => {
      if (setterEntry) {
        store.removeSetter(stateKey, setterEntry);
      }
    };
  }, [stateKey]);

  const useSubscribe = () => {
    /**
     * Emit a setter that will be used to trigger rendering
     * the component in the case a value corresponding the
     * stateKey has changed
     */
    const [, setter] = useState<boolean>(true);

    const store = useStore();

    /**
     * Update or initialize storing the setter in a record
     * keeping other setters corresponding the stateKey
     */
    useSmartMemo(() => {
      const setterEntry = store.addSetter(stateKey, setter);
      const { current: currentMemState } = memState;
      memState.current = { ...currentMemState, setterEntry };
    }, [stateKey]);

    return store.getValue(stateKey);
  };

  const setInterstate = useCallback<SetInterstate<T>>(valueToSet => {
    const {
      current: { stateKey: currentStateKey },
    } = memState;
    const prevValue: T = store.getValue(currentStateKey);
    const newValue = getNewValue(valueToSet, prevValue);

    if (prevValue !== newValue) {
      store.setValue(currentStateKey, newValue);
      store.triggerSetters(currentStateKey);
    }
  }, []);

  return [useSubscribe, setInterstate];
}

export type StateKey = MapKey;

export { useInterstate, Scope };
