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

  let triggerActionsPostponed: (() => void) | undefined;

  const initializeState: InitializeState = <T>(
    key: StateKey,
    conductInitValue?: ConductInitValue<T>
  ) => {
    let memSignature: symbol | undefined;

    const _mapEntryValue = storeMap.get(key);
    if (!_mapEntryValue) {
      throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
      fixControlFlowAnalysis();
    }

    const mapEntryValue = _mapEntryValue;

    if (conductInitValue && !mapEntryValue.isValueSetUp) {
      const { signature, initValue } = conductInitValue;
      memSignature = signature;
      mapEntryValue.value = isFunction(initValue) ? initValue() : initValue;
      mapEntryValue.initStatus = { signature };
    }

    function triggerSetters() {
      const { isValueSetUp, caughtError } = mapEntryValue;

      if (caughtError !== undefined) {
        return;
      }

      if (!isValueSetUp) {
        throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
      }

      for (const setterEntry of mapEntryValue) {
        if (isSetterListEntryErrorChunk(setterEntry)) {
          throwError(UseInterstateErrorCodes.NOT_BEEN_RECOVERED_AFTER_ERROR, { key });
        }

        setterEntry.setter((v) => !v);
      }
    }

    function resetInitState() {
      const { initStatus, caughtError } = mapEntryValue;

      if (caughtError !== undefined) {
        return;
      }

      if (!initStatus || initStatus.signature !== memSignature) {
        throwError(UseInterstateErrorCodes.CONCURRENTLY_PROVIDED_INIT_VALUE, { key });
      }

      mapEntryValue.isValueSetUp = true;
      mapEntryValue.initStatus = undefined;

      triggerActionsPostponed?.();
      triggerActionsPostponed = undefined;
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
        function setValueAction() {
          const { isValueSetUp, value: curVal } = mapEntryValue;

          if (!isValueSetUp) {
            throwError(UseInterstateErrorCodes.ACCESS_VALUE_NOT_BEEN_SET, { key });
          }

          const evalVal = isFunction(value) ? value(<T>curVal) : value;

          if (!Object.is(curVal, evalVal)) {
            mapEntryValue.value = evalVal;
            triggerSetters();
          }
        }

        const { initStatus, caughtError, triggerRegistered } = mapEntryValue;

        if (caughtError !== undefined) {
          throwError(caughtError, { key });
        }

        if (triggerRegistered) {
          throwError(UseInterstateErrorCodes.MULTIPLE_ATTEMPT_SET_STATE, { key });
        }

        if (initStatus) {
          triggerActionsPostponed = setValueAction;
        } else {
          setValueAction();
        }

        mapEntryValue.triggerRegistered = true;
      },

      addSetter(setter: Setter) {
        const { end, caughtError } = mapEntryValue;

        if (caughtError !== undefined) {
          return;
        }

        if (isSetterListEntryErrorChunk(end)) {
          throwError(UseInterstateErrorCodes.NOT_BEEN_RECOVERED_AFTER_ERROR, { key });
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

      ...(memSignature ? { resetInitState } : null),
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
    }

    mapValue.caughtError = undefined;
    mapValue.triggerRegistered = false;
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
