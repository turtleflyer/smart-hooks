import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import { MapKey, Store, InitStateServiceMethods, SetterServiceMethods } from './StoreMap';
import { storeFactory } from './storeFactory';
import { UseInterstateErrorCodes } from './errorHandle';
import { useSmartMemo } from '@smart-hooks/use-smart-memo';

declare const fixControlFlowAnalysis: () => never;

function isFunction(p: any): p is Function {
  return typeof p === 'function';
}

const globalStore = storeFactory();

type ScopeContextValue = { readonly store: Store } | undefined;

const ScopeContext = createContext<ScopeContextValue>(undefined);

const Scope: React.FunctionComponent = ({ children }) => {
  const [isolatedStore] = useState(() => storeFactory());

  return <ScopeContext.Provider value={{ store: isolatedStore }}>{children}</ScopeContext.Provider>;
};

export type InterstateParam<T> = Exclude<T, Function> | ((prevValue: T) => T);
export type InterstateInitializeParam<T> = Exclude<T, Function | undefined> | (() => T);

type SetInterstate<T> = (p: InterstateParam<T>) => void;

function useStore(): Store {
  const context = useContext<ScopeContextValue>(ScopeContext);

  return useMemo(() => context?.store || globalStore, []);
}

type AllUndefined<T> = { [P in keyof Required<T>]: undefined };

const cleanUpMergeInitStateServMeth: AllUndefined<InitStateServiceMethods<unknown>> = {
  getValue: undefined,
  setValue: undefined,
  triggerSetters: undefined,
  checkInitStatus: undefined,
  resetInitStatus: undefined,
  addSetter: undefined,
};

const cleanUpMergeSetterServMeth: AllUndefined<SetterServiceMethods> = {
  markSetterToSkip: undefined,
  removeSetter: undefined,
};

function useInterstate<T>(
  stateKey: MapKey,
  initValue?: InterstateInitializeParam<T>
): [() => T, SetInterstate<T>] {
  const { initState, throwError } = useStore();
  const memState = useRef<Partial<InitStateServiceMethods<T>>>({});

  useSmartMemo(() => {
    const { current: currentMemState } = memState;

    /**
     * Initializing usInterstate without an init value (or undefined value) preserves  the last
     * recorded value. If it is needed to set the value to undefined on the stage of initializing
     * then pass the function parameter () => undefined;
     */
    const initMethods = initState(
      stateKey,
      initValue !== undefined
        ? { initValue: isFunction(initValue) ? initValue() : initValue }
        : undefined
    );

    memState.current = { ...currentMemState, ...cleanUpMergeInitStateServMeth, ...initMethods };
  }, [stateKey]);

  useEffect(() => {
    const {
      current: currentMemState,
      current: { checkInitStatus, resetInitStatus, triggerSetters },
    } = memState;

    if (!checkInitStatus || !triggerSetters) {
      throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key: stateKey });
      fixControlFlowAnalysis();
    }

    const initStatus = checkInitStatus();

    /**
     * Having method 'resetInitStatus' shows it is the component where an initialization process
     * started and this component is responsible to trigger setters
     */
    if (resetInitStatus) {
      if (!initStatus) {
        throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key: stateKey });
        fixControlFlowAnalysis();
      }

      if (initStatus.mustTrigger) {
        triggerSetters();
      }

      resetInitStatus();

      memState.current = { ...currentMemState, resetInitStatus: undefined };
    }
  }, [stateKey]);

  const useSubscribe = () => {
    const subscribeMemState = useRef<Partial<SetterServiceMethods>>({});

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
        current: { removeSetter },
      } = subscribeMemState;

      removeSetter?.();

      if (!addSetter) {
        throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key: stateKey });
        fixControlFlowAnalysis();
      }

      const setterMethods = addSetter(setter);

      subscribeMemState.current = {
        ...subscribeMemState,
        ...cleanUpMergeSetterServMeth,
        ...setterMethods,
      };
    }, [stateKey]);

    const {
      current: { getValue, checkInitStatus },
    } = memState;

    const {
      current: { markSetterToSkip },
    } = subscribeMemState;

    if (!checkInitStatus || !markSetterToSkip || !getValue) {
      throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key: stateKey });
      fixControlFlowAnalysis();
    }

    const initStatus = checkInitStatus();

    if (initStatus && initStatus.mustTrigger) {
      markSetterToSkip();
    }

    useEffect(
      () => () => {
        const {
          current: { removeSetter },
        } = subscribeMemState;

        if (!removeSetter) {
          throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key: stateKey });
          fixControlFlowAnalysis();
        }

        removeSetter();
      },
      []
    );

    return getValue();
  };

  const setInterstate = useCallback<SetInterstate<T>>((valueToSet) => {
    const {
      current: { getValue, setValue, triggerSetters },
    } = memState;

    if (!getValue || !setValue || !triggerSetters) {
      throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key: stateKey });
      fixControlFlowAnalysis();
    }

    const curValue = getValue();
    const evalValue = isFunction(valueToSet) ? valueToSet(curValue) : valueToSet;

    if (curValue !== evalValue) {
      setValue(evalValue);

      triggerSetters();
    }
  }, []);

  return [useSubscribe, setInterstate];
}

export type StateKey = MapKey;

export { useInterstate, Scope };

export { isUseInterstateError, getUseInterstateErrorMethods } from './errorHandle';

export type { UseInterstateError } from './errorHandle';
