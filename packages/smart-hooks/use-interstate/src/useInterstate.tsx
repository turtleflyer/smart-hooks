import { useTraverseKeys } from '@smart-hooks/helper-traverse-scheme-keys';
import { useSmartMemo } from '@smart-hooks/use-smart-memo';
import type { FC } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { TrueObjectAssign } from './CommonTypes';
import { createStore } from './createStore';
import { UseInterstateErrorCodes } from './errorHandle';
import type { SetterMethods, Store, StoreMethods } from './StoreState';
import type {
  EnhanceObjectInterface,
  EnhancePlainInterface,
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

  const useInterstate = (<T extends unknown, S extends object>(
    a1: StateKey | InterstateInitializeObject<S>,
    initValue?: InterstateInitializeParam<T>
  ): EnhancePlainInterface<T> | EnhanceObjectInterface<S> => {
    interface KeepUseInterstateRecords {
      usingMultiStateScheme?: boolean;
    }
    const keepUseInterstateRecords = useRef({} as KeepUseInterstateRecords);

    const {
      current: curMainHookState,
      current: { usingMultiStateScheme },
    } = keepUseInterstateRecords;

    const { initializeState, runRenderTask, runEffectTask, throwError } = useStore();

    function checkUsingSchemeIntegrity(flagToSet: boolean) {
      if (usingMultiStateScheme === undefined) {
        keepUseInterstateRecords.current = {
          ...curMainHookState,
          usingMultiStateScheme: flagToSet,
        };
      } else if (usingMultiStateScheme === !flagToSet) {
        throwError(UseInterstateErrorCodes.INVALID_INTERFACE_CHANGE, {});
      }
    }

    function usePlainInterstate<PT extends unknown>(
      key: StateKey,
      initV?: InterstateInitializeParam<PT>
    ): readonly [() => PT, SetInterstate<PT>] {
      runRenderTask(key);

      const keepUsePlainInterstateRecords = useRef({} as StoreMethods<PT>);
      useSmartMemo(() => {
        keepUsePlainInterstateRecords.current = initializeState(key, initV);
      }, [key]);

      function useSubscribe() {
        const keepUseSubscribeRecords = useRef<Partial<SetterMethods> | null>(null);
        const {
          current: { getValue },
        } = keepUsePlainInterstateRecords;

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
          } = keepUsePlainInterstateRecords;

          keepUseSubscribeRecords.current?.removeSetterFromKeyList?.();

          keepUseSubscribeRecords.current = addSetter(setter);
        }, [key]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
        useEffect(() => keepUseSubscribeRecords.current?.removeSetterFromWatchList?.(), [key]);

        useEffect(() => () => keepUseSubscribeRecords.current?.removeSetterFromKeyList?.(), []);

        return getValue();
      }

      const setInterstate = useCallback<SetInterstate<PT>>((val) => {
        const {
          current: { setValue },
        } = keepUsePlainInterstateRecords;

        setValue(val);
      }, []);

      return [useSubscribe, setInterstate];
    }

    function useMultiInterstate(
      stateScheme: InterstateInitializeObject<S>
    ): readonly [() => InterstateStateObject<S>, InterstateSettersObject<S>] {
      const [subscribeObject, settersObject, enumKeys] = useTraverseKeys<
        InterstateInitializeObject<S>,
        { readonly [P in keyof S]: () => S[P] },
        { readonly [P in keyof S]: SetInterstate<S[P]> }
      >(stateScheme, (key, memStateScheme, subscribeObjectFulfill, settersObjectFulfill) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [useSubscr, setter] = usePlainInterstate<S[keyof S]>(key, memStateScheme[key]);
        subscribeObjectFulfill(useSubscr);
        settersObjectFulfill(setter);
      });

      function useSubscribe(): InterstateStateObject<S> {
        const evalState = {} as { [P in keyof S]: S[P] };
        enumKeys.forEach((key) => {
          evalState[key] = subscribeObject[key]();
          return evalState;
        });
        return evalState as InterstateStateObject<S>;
      }

      return [useSubscribe, settersObject];
    }

    useEffect(() => runEffectTask());

    let evalReturn: EnhancePlainInterface<T> | EnhanceObjectInterface<S>;
    if (typeof a1 === 'object') {
      checkUsingSchemeIntegrity(true);
      evalReturn = useMultiInterstate(a1) as EnhanceObjectInterface<S>;
    } else {
      checkUsingSchemeIntegrity(false);
      evalReturn = usePlainInterstate(a1, initValue) as EnhancePlainInterface<T>;
    }
    (Object.assign as TrueObjectAssign)(evalReturn, {
      get: evalReturn[0],
      set: (() => evalReturn[1]) as (() => SetInterstate<T>) | (() => InterstateSettersObject<S>),
      both: (() => [evalReturn[0](), evalReturn[1]]) as
        | (() => readonly [T, SetInterstate<T>])
        | (() => readonly [S, InterstateSettersObject<S>]),
    });

    return evalReturn;
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
