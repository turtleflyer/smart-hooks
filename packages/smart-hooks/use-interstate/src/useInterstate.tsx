import { useSmartMemo } from '@smart-hooks/use-smart-memo';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createStore } from './createStore';
import type { InterstateInitializeParam, InterstateParam, StateKey } from './InterstateParam';
import type { SetterMethods, Store, StoreMethods } from './StoreState';

export type SetInterstate<T = any> = (p: InterstateParam<T>) => void;

export function getUseInterstate() {
  let globalStore: Store;

  type ScopeContextValue = { readonly store: Store } | undefined;

  const ScopeContext = createContext<ScopeContextValue>(undefined);

  const Scope: React.FunctionComponent = ({ children }) => {
    const [isolatedStore] = useState(() => createStore());

    return (
      <ScopeContext.Provider value={{ store: isolatedStore }}>{children}</ScopeContext.Provider>
    );
  };

  function useStore(): Store {
    const context = useContext<ScopeContextValue>(ScopeContext);

    if (context) {
      return context.store;
    }

    globalStore = globalStore ?? createStore();

    return globalStore;
  }

  function useInterstate<T extends undefined>(
    key: StateKey,
    initValue?: T
  ): [() => unknown, SetInterstate<unknown>];

  function useInterstate<T>(
    key: StateKey,
    initValue: InterstateInitializeParam<T>
  ): (() => void) extends () => T
    ? [() => undefined, SetInterstate<undefined>]
    : [() => T, SetInterstate<T>];

  function useInterstate<T>(
    key: StateKey,
    initValue?: InterstateInitializeParam<T>
  ): [() => T, SetInterstate<T>] {
    const { initializeState, runRenderTask, runEffectTask } = useStore();
    const memState = useRef({} as StoreMethods<T>);
    runRenderTask(key);

    useSmartMemo(() => {
      memState.current = initializeState(
        key,

        /**
         * Initializing usInterstate without an init value (or undefined value) preserves the last
         * recorded value. If it is needed to set the value to undefined on the stage of
         * initializing then pass the function parameter () => undefined;
         */
        initValue === undefined ? undefined : { value: initValue }
      );
    }, [key]);

    useEffect(() => runEffectTask());

    const useSubscribe = () => {
      const subscribeMemState = useRef<Partial<SetterMethods>>({});
      const {
        current: { getValue },
      } = memState;

      /**
       * Emit a setter that will be used to trigger rendering the component in the case a value
       * corresponding the stateKey has changed
       */
      const [, setter] = useState<boolean>(true);

      /**
       * Update or initialize storing the setter in a record keeping other setters corresponding the
       * stateKey
       */
      useSmartMemo(() => {
        const {
          current: { addSetter },
        } = memState;

        const {
          current: { removeSetterFromKeyList },
        } = subscribeMemState;

        removeSetterFromKeyList?.();

        subscribeMemState.current = { ...addSetter(setter) };
      }, [key]);

      useEffect(() => {
        const {
          current: { removeSetterFromWatchList },
        } = subscribeMemState;

        removeSetterFromWatchList?.();
      }, [key]);

      useEffect(
        () => () => {
          const {
            current: { removeSetterFromKeyList },
          } = subscribeMemState;

          removeSetterFromKeyList?.();
        },
        []
      );

      return getValue();
    };

    const setInterstate = useCallback<SetInterstate<T>>((val) => {
      const {
        current: { setValue },
      } = memState;

      setValue(val);
    }, []);

    return [useSubscribe, setInterstate];
  }

  return { Scope, useInterstate };
}

const { Scope, useInterstate } = getUseInterstate();

export { getUseInterstateErrorsHandleMethods, isUseInterstateError } from './errorHandle';
export type { UseInterstateError, UseInterstateErrorMethods } from './errorHandle';
export { Scope, useInterstate };
export type { StateKey, InterstateParam, InterstateInitializeParam };
