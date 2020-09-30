import { useTraverseKeys } from '@smart-hooks/helper-traverse-scheme-keys';
import { useSmartMemo } from '@smart-hooks/use-smart-memo';
import type { FC } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createStore } from './createStore';
import type { UseInterstateThrowError } from './errorHandle';
import { UseInterstateErrorCodes } from './errorHandle';
import type { SetterMethods, Store, StoreMethods } from './StoreState';
import type {
  GetUseInterstate,
  InterstateInitializeObject,
  InterstateInitializeParam,
  InterstateParam,
  InterstateSettersObject,
  InterstateStateObject,
  SetInterstate,
  StateKey,
  UseInterstate,
} from './UseInterstateInterface';

export const getUseInterstate: GetUseInterstate = <M extends object>() => {
  let globalStore: Store;

  type ScopeContextValue = { readonly store: Store } | undefined;

  const ScopeContext = createContext<ScopeContextValue>(undefined);

  const Scope: FC = ({ children }) => {
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

  const useInterstate = (<T extends unknown>(
    a1: StateKey | InterstateInitializeObject<T & object>,
    initValue?: InterstateInitializeParam<T>
  ):
    | [() => T, SetInterstate<T>]
    | [() => InterstateStateObject<T & object>, InterstateSettersObject<T & object>] => {
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

    function usePlainInterstate<PT extends unknown>(
      key: StateKey,
      initV?: InterstateInitializeParam<PT>
    ): [() => PT, SetInterstate<PT>] {
      const { initializeState, runRenderTask, runEffectTask, throwError: throwErr } = useStore();
      mainRecord.current = { ...mainRecord.current, throwError: throwErr };

      const memState = useRef({} as StoreMethods<PT>);
      runRenderTask(key);

      useSmartMemo(() => {
        memState.current = initializeState(key, initV);
      }, [key]);

      useEffect(() => runEffectTask());

      function useSubscribe() {
        const subscribeMemState = useRef<Partial<SetterMethods> | null>({});
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
        useEffect(() => subscribeMemState.current?.removeSetterFromWatchList?.(), [key]);

        useEffect(() => () => subscribeMemState.current?.removeSetterFromKeyList?.(), []);

        return getValue();
      }

      const setInterstate = useCallback<SetInterstate<PT>>((val) => {
        const {
          current: { setValue },
        } = memState;

        setValue(val);
      }, []);

      return [useSubscribe, setInterstate];
    }

    function useMultiInterstate(
      stateScheme: InterstateInitializeObject<T & object>
    ): [() => InterstateStateObject<T & object>, InterstateSettersObject<T & object>] {
      const [subscribeObject, settersObject, enumKeys] = useTraverseKeys<
        InterstateInitializeObject<T & object>,
        { readonly [P in keyof (T & object)]: () => (T & object)[P] },
        { readonly [P in keyof (T & object)]: SetInterstate<(T & object)[P]> }
      >(stateScheme, (key, memStateScheme, subscribeObjectFulfill, settersObjectFulfill) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [useSubscr, setter] = usePlainInterstate<(T & object)[keyof (T & object)]>(
          key,
          memStateScheme[key]
        );
        subscribeObjectFulfill(useSubscr);
        settersObjectFulfill(setter);
      });

      function useSubscribe(): InterstateStateObject<T & object> {
        const evalState = {} as { [P in keyof (T & object)]: (T & object)[P] };
        enumKeys.forEach((key) => {
          evalState[key] = subscribeObject[key]();
          return evalState;
        });
        return evalState as InterstateStateObject<T & object>;
      }

      return [useSubscribe, settersObject as InterstateSettersObject<T & object>];
    }

    if (typeof a1 === 'object') {
      checkUsingSchemeIntegrity(true);
      return useMultiInterstate(a1);
    }

    checkUsingSchemeIntegrity(false);
    return usePlainInterstate(a1, initValue);
  }) as UseInterstate<M>;

  return { Scope, useInterstate };
};

const { Scope, useInterstate } = getUseInterstate();

export { getUseInterstateErrorsHandleMethods, isUseInterstateError } from './errorHandle';
export type { UseInterstateError, UseInterstateErrorMethods } from './errorHandle';
export { Scope, useInterstate };
export type {
  GetUseInterstate,
  InterstateInitializeParam,
  InterstateParam,
  SetInterstate,
  StateKey,
  UseInterstate,
  InterstateStateObject,
  InterstateInitializeObject,
  InterstateSettersObject,
};
