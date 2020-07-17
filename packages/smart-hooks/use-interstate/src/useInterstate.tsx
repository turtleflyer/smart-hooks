import { useSmartMemo } from '@smart-hooks/use-smart-memo';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { UnsealReadOnly } from '../../../../common_types/UnsealReadOnly';
import { createStore } from './createStore';
import { UseInterstateErrorCodes } from './errorHandle';
import type { UseInterstateThrowError } from './errorHandle';
import type { InterstateInitializeParam, InterstateParam, StateKey } from './InterstateParam';
import type { SetterMethods, Store, StoreMethods } from './StoreState';

type InferStateTypeFromInitType<
  T extends InterstateInitializeParam<unknown> | undefined
> = T extends undefined
  ? unknown
  : T extends InterstateParam<infer P>
  ? (() => void) extends () => P
    ? undefined
    : P
  : never;

type InferStateObject<S extends object> = { [P in keyof S]: InferStateTypeFromInitType<S[P]> };

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

type ResolveStructure<T> = T extends object ? { [P in keyof T]: T[P] } : { a: false };

interface MainHookState {
  usingMultiStateScheme?: boolean;
  throwError: UseInterstateThrowError;
}

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

  function useInterstate<T extends undefined>(
    key: StateKey,
    initValue?: T
  ): [() => unknown, SetInterstate<unknown>];

  function useInterstate<S extends object>(
    stateScheme: UseInterstateInitializeObject<S>
  ): [
    () => ResolveStructure<UseInterstateStateObject<S>>,
    ResolveStructure<UseInterstateSettersObject<S>>
  ];

  function useInterstate<T>(
    key: StateKey,
    initValue?: InterstateInitializeParam<T>
  ): (() => void) extends () => T
    ? [() => undefined, SetInterstate<undefined>]
    : [() => T, SetInterstate<T>];

  function useInterstate<T>(
    p1: StateKey | T,
    initValue?: InterstateInitializeParam<T>
  ):
    | [() => T, SetInterstate<T>]
    | [
        () => UseInterstateStateObject<InferStateObject<T & object>>,
        UseInterstateSettersObject<InferStateObject<T & object>>
      ] {
    const mainRecord = useRef({} as MainHookState);

    const {
      current: curMainHookState,
      current: { usingMultiStateScheme, throwError },
    } = mainRecord;

    function checkUsingSchemeIntegrity(flagToSet: boolean) {
      if (usingMultiStateScheme === undefined) {
        curMainHookState.usingMultiStateScheme = flagToSet;
      } else if (usingMultiStateScheme === !flagToSet) {
        throwError(UseInterstateErrorCodes.INVALID_INTERFACE_CHANGE, {});
      }
    }

    if (typeof p1 === 'object') {
      checkUsingSchemeIntegrity(true);
      return useMultiInterstate(curMainHookState, p1 as T & object);
    }

    checkUsingSchemeIntegrity(false);
    return usePlainInterstate(curMainHookState, p1 as StateKey, initValue);
  }

  function useMultiInterstate<S extends object>(
    mainHookState: MainHookState,
    stateScheme: S
  ): [
    () => UseInterstateStateObject<InferStateObject<S>>,
    UseInterstateSettersObject<InferStateObject<S>>
  ] {
    const [memStateScheme] = useState(stateScheme);

    const enumKeys = useMemo(
      () =>
        [
          ...Object.keys(memStateScheme),
          ...Object.getOwnPropertySymbols(memStateScheme).filter((key) =>
            memStateScheme.propertyIsEnumerable(key)
          ),
        ] as (keyof S)[],
      []
    );

    const subscribeObject = {} as { [P in keyof S]: () => InferStateTypeFromInitType<S[P]> };
    const { current: settersObject } = useRef(
      {} as UnsealReadOnly<UseInterstateSettersObject<InferStateObject<S>>>
    );

    for (const key of enumKeys) {
      const [useSubscribe, setter] = usePlainInterstate(
        mainHookState,
        key,
        memStateScheme[key] as InterstateInitializeParam<InferStateTypeFromInitType<S[keyof S]>>
      );
      subscribeObject[key] = useSubscribe;
      settersObject[key] = setter;
    }

    function useSubscribe() {
      return enumKeys.reduce((evalState, key) => {
        evalState[key] = subscribeObject[key]();
        return evalState;
      }, {} as UnsealReadOnly<UseInterstateStateObject<InferStateObject<S>>>);
    }

    return [
      useSubscribe as () => UseInterstateStateObject<InferStateObject<S>>,
      settersObject as UseInterstateSettersObject<InferStateObject<S>>,
    ];
  }

  function usePlainInterstate<T>(
    mainHookState: MainHookState,
    key: StateKey,
    initValue?: InterstateInitializeParam<T>
  ): [() => T, SetInterstate<T>] {
    const { initializeState, runRenderTask, runEffectTask, throwError } = useStore();
    mainHookState.throwError = throwError;

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

    function useSubscribe() {
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
    }

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
