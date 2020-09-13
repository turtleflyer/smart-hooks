import type { TrueObjectAssign } from './CommonTypes';
import { createSettersList } from './createSettersList';
import { createSettersListEntry } from './createSettersListEntry';
import { createStoreState } from './createStoreState';
import { createThrowError, UseInterstateErrorCodes } from './errorHandle';
import type {
  InterstateInitializeParam,
  InterstateParam,
  Setter,
  StateKey,
} from './UseInterstateInterface';
import { removeSetterEntry } from './removeSetterEntry';
import type { SettersWatchList, SettersWatchListEntry } from './SettersLists';
import { isSetterListEntryErrorChunk } from './StoreMap';
import type { MapValue, MapValueSettersListEntry } from './StoreMap';
import type { InitializeState, Store } from './StoreState';

declare function fixControlFlowAnalysis(): never;

function isFunction(p: unknown): p is (...arg: never[]) => unknown {
  return typeof p === 'function';
}

const initParamIsFunction: <T extends unknown>(
  p: InterstateInitializeParam<T>
) => p is InterstateInitializeParam<T> & (() => T) = isFunction as never;

const paramIsFunction: <T extends unknown>(
  p: InterstateParam<T>
) => p is (a: T) => T = isFunction as never;

function isDefined<T extends unknown>(val: T | undefined, isSetUp: boolean): val is T {
  return isSetUp;
}

export function createStore(): Store {
  const storeState = createStoreState();

  const throwError = createThrowError(storeState);

  const { storeMap, settersWatchList, renderTask, effectTask } = storeState;

  const initializeState: InitializeState = <T extends unknown>(
    key: StateKey,
    initValue: InterstateInitializeParam<T> | undefined
  ) => {
    const considerMapEntryValue = storeMap.get(key) as MapValue<T> | undefined;
    if (!considerMapEntryValue) {
      throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
      fixControlFlowAnalysis();
    }

    const mapEntryValue: MapValue<T> = considerMapEntryValue;

    const { isValueSetUp: isValueSetUpWhileInit, initStatus: initStatusWhileInit } = mapEntryValue;

    if (initValue !== undefined && (initStatusWhileInit || !isValueSetUpWhileInit)) {
      const evalValue = initParamIsFunction(initValue) ? initValue() : (initValue as T);

      if (initStatusWhileInit) {
        if (initStatusWhileInit.value !== evalValue) {
          throwError(UseInterstateErrorCodes.CONCURRENTLY_PROVIDED_INIT_VALUE, { key });
        }
      } else {
        (Object.assign as TrueObjectAssign)(mapEntryValue, {
          value: evalValue,
          initStatus: { value: evalValue },
          isValueSetUp: true,
        });
      }
    }

    return {
      getValue() {
        const { value, isValueSetUp, initStatus } = mapEntryValue;

        if (!isValueSetUp && !initStatus) {
          throwError(UseInterstateErrorCodes.ACCESS_VALUE_NOT_BEEN_SET, { key });
        }

        return value as T;
      },

      setValue(value: InterstateParam<T>) {
        const { caughtError, triggerRegistered, isValueSetUp, value: curVal } = mapEntryValue;

        if (caughtError !== undefined) {
          throwError(caughtError, { key });
        }

        if (triggerRegistered) {
          throwError(UseInterstateErrorCodes.MULTIPLE_ATTEMPT_SET_STATE, { key });
        }

        if (!isDefined(curVal, isValueSetUp)) {
          throwError(UseInterstateErrorCodes.ACCESS_VALUE_NOT_BEEN_SET, { key });
          fixControlFlowAnalysis();
        }

        const evalVal = paramIsFunction(value) ? value(curVal) : value;

        if (!Object.is(curVal, evalVal)) {
          mapEntryValue.value = evalVal;

          // eslint-disable-next-line no-restricted-syntax
          for (const setterEntry of mapEntryValue) {
            if (isSetterListEntryErrorChunk(setterEntry)) {
              throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
            }

            setterEntry.setter((v) => !v);
          }
        }

        mapEntryValue.triggerRegistered = true;
      },

      addSetter(setter: Setter) {
        const { end, caughtError } = mapEntryValue;

        if (caughtError !== undefined) {
          return null;
        }

        if (isSetterListEntryErrorChunk(end)) {
          throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
        }

        function removeSetterFromKeyList() {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          removeSetterEntry(setterEntry, mapEntryValue, {
            throwError,
            key,
          });
        }

        function removeSetterFromWatchList() {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          removeSetterEntry(watchListEntry, settersWatchList, {
            throwError,
            key,
          });
        }

        const setterEntry = createSettersListEntry<MapValueSettersListEntry, MapValue>(
          {
            setter,
            errorChunk: false,
            removeFromWatchList: removeSetterFromWatchList,
          },
          mapEntryValue,
          {
            throwError,
            key,
          }
        );

        const watchListEntry = createSettersListEntry<SettersWatchListEntry, SettersWatchList>(
          { removeFromStore: removeSetterFromKeyList },
          settersWatchList,
          { throwError, key }
        );

        return {
          removeSetterFromKeyList,
          removeSetterFromWatchList,
        };
      },
    };
  };

  function runRenderTask(key: StateKey) {
    renderTask.run();

    if (!storeMap.has(key)) {
      storeMap.set(
        key,
        createSettersList<MapValue>(
          {
            isValueSetUp: false,
          },
          { throwError, key }
        )
      );
    }

    const mapValue = storeMap.get(key) as MapValue<unknown>;

    const { value, isValueSetUp } = mapValue;

    const { memValuesMap } = storeState;

    if (!memValuesMap.has(key)) {
      memValuesMap.set(key, isValueSetUp ? { value } : undefined);

      (Object.assign as TrueObjectAssign)(mapValue, {
        caughtError: undefined,
        triggerRegistered: false,
        initStatus: undefined,
      });
    }
  }

  function runEffectTask() {
    effectTask.run();
  }

  return {
    initializeState,
    runRenderTask,
    runEffectTask,
    throwError,
  };
}
