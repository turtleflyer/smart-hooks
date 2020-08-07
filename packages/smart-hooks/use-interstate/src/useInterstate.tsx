import { useTraverseKeys } from '@smart-hooks/helper-traverse-scheme-keys';
import { useSmartMemo } from '@smart-hooks/use-smart-memo';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createStore } from './createStore';
import { UseInterstateErrorCodes } from './errorHandle';
import type { UseInterstateThrowError } from './errorHandle';
import type { InterstateInitializeParam, InterstateParam, StateKey } from './InterstateParam';
import type { SetterMethods, Store, StoreMethods } from './StoreState';

type UnsealReadOnly<R extends object> = { [P in keyof R]: R[P] };

export type UseInterstateInitializeObject<S extends object> = {
  [P in keyof S]: InterstateInitializeParam<S[P]> | undefined;
};

export type SetInterstate<T = any> = (p: InterstateParam<T>) => void;

export type UseInterstateSettersObject<S extends object> = {
  readonly [P in keyof S]: SetInterstate<S[P]>;
};

export type UseInterstateStateObject<S extends object> = {
  readonly [P in keyof S]: S[P];
};

export function getUseInterstate() {
  let globalStore: Store;

  type ScopeContextValue = { readonly store: Store } | undefined;

  const ScopeContext = createContext<ScopeContextValue>(undefined);

  const Scope: React.FunctionComponent = ({ children }) => {
    const [isolatedStore] = useState(createStore);

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

  interface MainHookState {
    usingMultiStateScheme?: boolean;
    throwError: UseInterstateThrowError;
  }

  function useInterstate<T extends undefined>(
    key: StateKey,
    initValue?: T
  ): [() => unknown, SetInterstate<unknown>];

  function useInterstate<S extends object>(
    stateScheme: UseInterstateInitializeObject<S>
  ): [() => UseInterstateStateObject<S>, UseInterstateSettersObject<S>];

  function useInterstate<T>(
    key: StateKey,
    initValue?: InterstateInitializeParam<T>
  ): (() => void) extends () => T
    ? [() => undefined, SetInterstate<undefined>]
    : [() => T, SetInterstate<T>];

  function useInterstate<T>(
    p1: StateKey | UseInterstateInitializeObject<T & object>,
    initValue?: InterstateInitializeParam<T>
  ):
    | [() => T, SetInterstate<T>]
    | [() => UseInterstateStateObject<T & object>, UseInterstateSettersObject<T & object>] {
    const mainRecord = useRef({} as MainHookState);

    const {
      current: curMainHookState,
      current: { usingMultiStateScheme, throwError },
    } = mainRecord;

    function checkUsingSchemeIntegrity(flagToSet: boolean) {
      if (usingMultiStateScheme === undefined) {
        mainRecord.current = { ...curMainHookState, usingMultiStateScheme: flagToSet };
      } else if (usingMultiStateScheme === !flagToSet) {
        throwError(UseInterstateErrorCodes.INVALID_INTERFACE_CHANGE, {});
      }
    }

    function usePlainInterstate<T>(
      key: StateKey,
      initValue?: InterstateInitializeParam<T>
    ): [() => T, SetInterstate<T>] {
      const { initializeState, runRenderTask, runEffectTask, throwError } = useStore();
      mainRecord.current = { ...mainRecord.current, throwError };

      const memState = useRef({} as StoreMethods<T>);
      runRenderTask(key);

      useSmartMemo(() => {
        memState.current = initializeState(key, initValue);
      }, [key]);

      useEffect(() => runEffectTask());

      function useSubscribe() {
        const subscribeMemState = useRef<Partial<SetterMethods> | undefined>({});
        const {
          current: { getValue },
        } = memState;

        /**
         * Emit a setter that will be used to trigger rendering the component in the case a value
         * corresponding the stateKey has changed
         */
        const [, setter] = useState<boolean>(true);

        /**
         * For the first call or in the case of changing the subscription key it will place the
         * setter in the list relevant to this key
         */
        useSmartMemo(() => {
          const {
            current: { addSetter },
          } = memState;

          subscribeMemState.current?.removeSetterFromKeyList?.();

          subscribeMemState.current = addSetter(setter);
        }, [key]);

        useEffect(() => subscribeMemState.current?.removeSetterFromWatchList?.(), [key]);

        useEffect(() => () => subscribeMemState.current?.removeSetterFromKeyList?.(), []);

        return getValue();
      }

      const setInterstate = useCallback<SetInterstate<T>>((val) => {
        const {
          current: { setValue },
        } = memState;

        setValue(val);
      }, []);

      return [useSubscribe, setInterstate];
    }

    function useMultiInterstate<S extends object>(
      stateScheme: UseInterstateInitializeObject<S>
    ): [() => UseInterstateStateObject<S>, UseInterstateSettersObject<S>] {
      const [subscribeObject, settersObject, enumKeys] = useTraverseKeys<
        UseInterstateInitializeObject<S>,
        { readonly [P in keyof S]: () => S[P] },
        UseInterstateSettersObject<S>
      >(stateScheme, (key, memStateScheme, subscribeObjectFulfill, settersObjectFulfill) => {
        const [useSubscribe, setter] = usePlainInterstate(key, memStateScheme[key]);
        subscribeObjectFulfill(useSubscribe);
        settersObjectFulfill(setter);
      });

      function useSubscribe() {
        return enumKeys.reduce((evalState, key) => {
          evalState[key] = subscribeObject[key]();
          return evalState;
        }, {} as UnsealReadOnly<UseInterstateStateObject<S>>);
      }

      return [useSubscribe, settersObject];
    }

    if (typeof p1 === 'object') {
      checkUsingSchemeIntegrity(true);
      return useMultiInterstate(p1);
    }

    checkUsingSchemeIntegrity(false);
    return usePlainInterstate(p1 as StateKey, initValue);
  }

  return { Scope, useInterstate };
}

const { Scope, useInterstate } = getUseInterstate();

export { getUseInterstateErrorsHandleMethods, isUseInterstateError } from './errorHandle';
export type { UseInterstateError, UseInterstateErrorMethods } from './errorHandle';
export { Scope, useInterstate };
export type { StateKey, InterstateParam, InterstateInitializeParam };
