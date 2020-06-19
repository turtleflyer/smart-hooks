import { createSettersList } from './createSettersList';
import { createSettersListEntry } from './createSettersListEntry';
import { createStoreState } from './createStoreState';
import { createThrowError, UseInterstateErrorCodes } from './errorHandle';
import type { InterstateParam, Setter, StateKey } from './InterstateParam';
import { removeSetterEntry } from './removeSetterEntry';
import type { SettersWatchList, SettersWatchListEntry } from './SettersLists';
import { isSetterListEntryErrorChunk } from './StoreMap';
import type { MapValue, MapValueSettersListEntry } from './StoreMap';
import type { ConductInitValue, InitializeState, Store } from './StoreState';

declare function fixControlFlowAnalysis(): never;

function isFunction(p: any): p is (...arg: any[]) => any {
  return typeof p === 'function';
}

export function createStore(): Store {
  const storeState = createStoreState();

  const throwError = createThrowError(storeState);

  const { storeMap, settersWatchList, renderTask, effectTask } = storeState;

  const initializeState: InitializeState = <T>(
    key: StateKey,
    conductInitValue?: ConductInitValue<T>
  ) => {
    const _mapEntryValue = storeMap.get(key);
    if (!_mapEntryValue) {
      throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
      fixControlFlowAnalysis();
    }

    const mapEntryValue: MapValue<T> = _mapEntryValue;

    const { isValueSetUp, initStatus } = mapEntryValue;

    let evalValue: T | undefined;

    if (conductInitValue && (initStatus || !isValueSetUp)) {
      const { value } = conductInitValue;
      evalValue = isFunction(value) ? value() : value;

      if (initStatus) {
        if (initStatus.value !== evalValue) {
          throwError(UseInterstateErrorCodes.CONCURRENTLY_PROVIDED_INIT_VALUE, { key });
        }
      } else {
        mapEntryValue.value = evalValue;
        mapEntryValue.initStatus = { value: evalValue };
        mapEntryValue.isValueSetUp = true;
      }
    }

    return {
      getValue() {
        const { value, isValueSetUp, initStatus } = mapEntryValue;

        if (!isValueSetUp && !initStatus) {
          throwError(UseInterstateErrorCodes.ACCESS_VALUE_NOT_BEEN_SET, { key });
        }

        return <T>value;
      },

      setValue(value: InterstateParam<T>) {
        const { caughtError, triggerRegistered, isValueSetUp, value: curVal } = mapEntryValue;

        if (caughtError !== undefined) {
          throwError(caughtError, { key });
        }

        if (triggerRegistered) {
          throwError(UseInterstateErrorCodes.MULTIPLE_ATTEMPT_SET_STATE, { key });
        }

        if (!isValueSetUp) {
          throwError(UseInterstateErrorCodes.ACCESS_VALUE_NOT_BEEN_SET, { key });
        }

        const evalVal = isFunction(value) ? value(<T>curVal) : value;

        if (!Object.is(curVal, evalVal)) {
          mapEntryValue.value = evalVal;

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
          return;
        }

        if (isSetterListEntryErrorChunk(end)) {
          throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
        }

        function removeSetterFromKeyList() {
          removeSetterEntry(setterEntry, mapEntryValue, {
            throwError,
            key,
          });
        }

        function removeSetterFromWatchList() {
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

    const mapValue = storeMap.get(key)!;

    const { value, isValueSetUp } = mapValue;

    const { memValuesMap } = storeState;

    if (!memValuesMap.has(key)) {
      memValuesMap.set(key, isValueSetUp ? { value } : undefined);
      
      mapValue.caughtError = undefined;
      mapValue.triggerRegistered = false;
      mapValue.initStatus = undefined;
    }
  }

  function runEffectTask() {
    effectTask.run();
  }

  return {
    initializeState,
    runRenderTask,
    runEffectTask,
  };
}
