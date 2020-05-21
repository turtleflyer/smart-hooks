import {
  MapKey,
  Setter,
  SettersListEntry,
  SettersListEntryFirst,
  SettersListEntryLast,
  SettersListEntryFirstAndLast,
  SettersListEntryErrorChunk,
  MapValueIterator,
  MapValue,
  MapValueSubscribed,
  MapValueNotSubscribed,
  MapValueActiveInitStatus,
  InitStateServiceMethods,
  InitStateMethod,
  Store,
} from './StoreMap';
import { createStoreMap } from './createStoreMap';
import { UseInterstateErrorCodes, UseInterstateThrowError, composeThrowError } from './errorHandle';

function composeMapValueIterator<T>(v: MapValue<T>): MapValueIterator {
  return function mapValueIterator() {
    let entry: SettersListEntry | undefined = v.startOfSettersList;

    return {
      next() {
        if (entry) {
          const curEntry = entry;
          entry = entry.next;
          return { value: curEntry, done: false };
        }

        return { value: undefined, done: true };
      },
    };
  };
}

function isSetterListEntryErrorChunk(e: SettersListEntry): e is SettersListEntryErrorChunk {
  return !!e.errorChunk;
}

function createSetterListEntry<P extends SettersListEntryLast | undefined>(
  setter: Setter,
  lastSetter: P,
  { throwError, key }: { throwError: UseInterstateThrowError; key?: MapKey }
): P extends undefined
  ? SettersListEntryFirstAndLast
  : P extends SettersListEntryErrorChunk
  ? never
  : SettersListEntry<{ isFirstEntry: false; isLastEntry: true }>;

function createSetterListEntry(
  setter: Setter,
  lastSetter: SettersListEntryLast | undefined,
  { throwError, key }: { throwError: UseInterstateThrowError; key?: MapKey }
) {
  const entry = <SettersListEntryLast>{
    prev: <SettersListEntryLast | undefined>lastSetter,
    next: undefined,
    setter,
  };

  if (lastSetter) {
    if (isSetterListEntryErrorChunk(lastSetter)) {
      throwError(UseInterstateErrorCodes.NOT_BEEN_RECOVERED_AFTER_ERROR, { key });
    }

    (<SettersListEntry<{ isLastEntry: false }>>(<unknown>lastSetter)).next = <
      SettersListEntry<{ isFirstEntry: false }>
    >(<unknown>entry);
  }

  return entry;
}

function createMapValue<T, P extends Omit<MapValue<T>, ''> = Omit<MapValue<T>, ''>>(
  props: P,
  { throwError, key }: { throwError: UseInterstateThrowError; key?: MapKey }
): P extends {
  startOfSettersList: SettersListEntry;
}
  ? P extends {
      endOfSettersList: SettersListEntry;
    }
    ? MapValueSubscribed<T>
    : never
  : P extends {
      endOfSettersList: SettersListEntry;
    }
  ? never
  : MapValueNotSubscribed<T>;

function createMapValue<T>(
  props: Omit<MapValue<T>, ''>,
  { throwError, key }: { throwError: UseInterstateThrowError; key?: MapKey }
) {
  const { startOfSettersList, endOfSettersList } = props;
  if ((!startOfSettersList && endOfSettersList) || (startOfSettersList && !endOfSettersList)) {
    throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
  }

  const evalMapValue: Omit<MapValue<T>, ''> = {
    ...props,
  };

  Object.assign(evalMapValue, {
    [Symbol.iterator]: composeMapValueIterator(<MapValue<T>>evalMapValue),
  });

  return <MapValue<T>>evalMapValue;
}

function isMapValueNotSubscribed<T>(
  v: MapValue<T>,
  { throwError, key }: { throwError: UseInterstateThrowError; key?: MapKey }
): v is MapValueNotSubscribed<T> {
  const { startOfSettersList, endOfSettersList } = v;

  if (!startOfSettersList) {
    if (endOfSettersList) {
      throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
    }
    return true;
  } else if (!endOfSettersList) {
    throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
  }

  return false;
}

function hasMapValueActiveInitStatus<T>(v: MapValue<T>): v is MapValueActiveInitStatus<T> {
  return !!v.initStatus;
}

function storeFactory(): Store {
  const storeMap = createStoreMap();

  const throwError = composeThrowError(storeMap);

  function initState<T>(
    key: MapKey,
    conductInitValue?: { initValue: T }
  ): InitStateServiceMethods<T> {
    if (!storeMap.has(key)) {
      storeMap.set(key, createMapValue({ initStatus: false }, { throwError }));
    }

    const curMapValue = <MapValue<T>>storeMap.get(key);
    const { valueRecord: curValueRecord } = curMapValue;

    if (conductInitValue && hasMapValueActiveInitStatus(curMapValue)) {
      throwError(UseInterstateErrorCodes.CONCURRENTLY_PROVIDED_INIT_VALUE, { key });
    }

    if (conductInitValue) {
      const { initValue } = conductInitValue;
      storeMap.set(
        key,
        createMapValue<T>(
          {
            ...curMapValue,
            valueRecord: initValue,
            valueWasSet: true,
            initStatus: {
              mustTrigger: initValue !== curValueRecord,
            },
          },
          { throwError }
        )
      );
    }

    return {
      getValue() {
        const mapValue = <MapValue<T>>storeMap.get(key);
        const { valueRecord, valueWasSet } = mapValue;

        if (!valueWasSet) {
          throwError(UseInterstateErrorCodes.ACCESS_VALUE_NOT_BEEN_SET, { key });
        }

        return valueRecord!;
      },

      setValue(value: T) {
        const curMapValue = <MapValue<T>>storeMap.get(key);

        storeMap.set(
          key,
          createMapValue<T>(
            {
              ...curMapValue,
              valueWasSet: true,
              valueRecord: value,
            },
            { throwError }
          )
        );
      },

      triggerSetters() {
        const mapValue = <MapValue<T>>storeMap.get(key);

        for (const setterEntry of mapValue) {
          if (isSetterListEntryErrorChunk(setterEntry)) {
            throwError(UseInterstateErrorCodes.NOT_BEEN_RECOVERED_AFTER_ERROR, { key });
          }

          if (setterEntry.skipTriggering) {
            setterEntry.skipTriggering = false;
          } else {
            setterEntry.setter((v) => !v);
          }
        }
      },

      checkInitStatus() {
        return (<MapValue<T>>storeMap.get(key)).initStatus;
      },

      resetInitStatus: conductInitValue
        ? () => {
            const curMapValue = <MapValue<T>>storeMap.get(key);

            storeMap.set(
              key,
              createMapValue<T>({ ...curMapValue, initStatus: false }, { throwError })
            );
          }
        : undefined,

      addSetter(setter: Setter) {
        const curMapValue = <MapValue<T>>storeMap.get(key);

        const { startOfSettersList, endOfSettersList } = curMapValue;

        const evalSetterEntry = createSetterListEntry(setter, endOfSettersList, {
          throwError,
          key,
        });

        storeMap.set(
          key,
          createMapValue<T>(
            {
              ...curMapValue,
              startOfSettersList: isMapValueNotSubscribed(curMapValue, { throwError })
                ? <SettersListEntryFirstAndLast>evalSetterEntry
                : startOfSettersList!,
              endOfSettersList: evalSetterEntry,
            },
            { throwError }
          )
        );

        return {
          markSetterToSkip() {
            if (isSetterListEntryErrorChunk(evalSetterEntry)) {
              return;
            }

            evalSetterEntry.skipTriggering = true;
          },

          removeSetter() {
            if (isSetterListEntryErrorChunk(evalSetterEntry)) {
              return;
            }

            const curMapValue = <MapValue<T>>storeMap.get(key);

            if (isMapValueNotSubscribed(curMapValue, { throwError })) {
              throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
            }

            if (evalSetterEntry.skipTriggering) {
              throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
            }

            function closeSettersListEndpoint<
              E extends SettersListEntryFirst | SettersListEntryLast,
              S extends 'prev' | 'next'
            >(
              endpoint: E,
              sideKey: S
            ): E extends SettersListEntryFirst
              ? S extends 'next'
                ? SettersListEntryFirst | undefined
                : never
              : S extends 'prev'
              ? SettersListEntryLast | undefined
              : never;

            function closeSettersListEndpoint(
              endpoint: SettersListEntryFirst | SettersListEntryLast,
              sideKey: 'prev' | 'next'
            ) {
              if (evalSetterEntry === endpoint) {
                return evalSetterEntry[sideKey];
              } else {
                (<SettersListEntry>evalSetterEntry[sideKey === 'prev' ? 'next' : 'prev'])[
                  sideKey
                ] = <SettersListEntry | undefined>evalSetterEntry[sideKey];
                return endpoint;
              }
            }

            const { startOfSettersList, endOfSettersList } = <MapValueSubscribed<T>>curMapValue;

            storeMap.set(
              key,
              createMapValue<T>(
                {
                  ...curMapValue,
                  startOfSettersList: closeSettersListEndpoint(startOfSettersList, 'next'),
                  endOfSettersList: closeSettersListEndpoint(endOfSettersList, 'prev'),
                },
                { throwError }
              )
            );
          },
        };
      },
    };
  }

  return {
    throwError,
    initState: <InitStateMethod>initState,
  };
}

export { storeFactory };
