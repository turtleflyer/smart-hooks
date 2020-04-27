export class UseInterstateError extends Error {
  constructor(message?: string) {
    super(`(useInterstate Error) ${message}`);
  }
}

export type MapKey = string | number | symbol;
type Setter = React.Dispatch<React.SetStateAction<boolean>>;

export type SettersListEntry<
  C extends { isItFirstEntry?: boolean; isItLastEntry?: boolean } = {}
> = {
  prev: C extends { isItFirstEntry: true }
    ? undefined
    : C extends { isItFirstEntry: false }
    ? SettersListEntry<{ isItLastEntry: false }>
    : SettersListEntry<{ isItLastEntry: false }> | undefined;

  next: C extends { isItLastEntry: true }
    ? undefined
    : C extends { isItLastEntry: false }
    ? SettersListEntry<{ isItFirstEntry: false }>
    : SettersListEntry<{ isItFirstEntry: false }> | undefined;

  setter: Setter;
};

type MapValueIterator<T> = (this: MapValue<T>) => Generator<SettersListEntry>;

interface MapValueFilled<T> {
  startOfSettersList: SettersListEntry<{ isItFirstEntry: true }>;
  endOfSettersList: SettersListEntry<{ isItLastEntry: true }>;
  valueRecord?: T;
  [Symbol.iterator]: MapValueIterator<T>;
}

interface MapValueEmpty<T> {
  startOfSettersList?: undefined;
  endOfSettersList?: undefined;
  valueRecord?: T;
  [Symbol.iterator]: MapValueIterator<T>;
}

type MapValue<T> = MapValueFilled<T> | MapValueEmpty<T>;

const nextSetter = function*<T>(this: MapValue<T>) {
  let currentSettersListEntry: SettersListEntry | undefined = this
    .startOfSettersList;
  while (currentSettersListEntry) {
    yield currentSettersListEntry;
    currentSettersListEntry = currentSettersListEntry.next;
  }
};

function isMapValueEmpty(v: MapValue<any>): v is MapValueEmpty<any> {
  function throwError() {
    throw new UseInterstateError(
      'A map value in the store must have "startOfSettersList" and "endOfSettersList" properties either both undefined or filled by some value'
    );
  }

  const { startOfSettersList, endOfSettersList } = v;

  if (!startOfSettersList) {
    if (endOfSettersList) {
      throwError();
    }
    return true;
  } else if (!endOfSettersList) {
    throwError();
  }

  return false;
}

type StoreMap = Map<MapKey, MapValue<any>>;

export interface Store {
  initEntry(key: MapKey): void;
  addSetter(
    key: MapKey,
    setter: Setter
  ): SettersListEntry<{ isItLastEntry: true }>;
  removeSetter(key: MapKey, setterEntry: SettersListEntry): void;
  triggerSetters(key: MapKey, exceptSetterEntry?: SettersListEntry): void;
  getValue(key: MapKey): any;
  setValue(key: MapKey, value: any): void;
}

function throwErrorKeyNotExist(key: MapKey): never {
  throw new UseInterstateError(
    `Requested map value for the key ${key.toString()} does not exist`
  );
}

function storeFactory(): Store {
  const storeMap: StoreMap = new Map();

  return {
    initEntry(key) {
      if (!storeMap.has(key)) {
        storeMap.set(key, { [Symbol.iterator]: nextSetter });
      }
    },

    addSetter(key, setter) {
      const mapValue = storeMap.get(key);
      if (!mapValue) {
        throwErrorKeyNotExist(key);
      }

      const newValue = (function getNewValue<T>(
        v: MapValue<T>
      ): MapValueFilled<T> {
        if (isMapValueEmpty(v)) {
          const setterEntry: SettersListEntry<{
            isItFirstEntry: true;
            isItLastEntry: true;
          }> = { prev: undefined, next: undefined, setter };
          return {
            startOfSettersList: setterEntry,
            endOfSettersList: setterEntry,
            valueRecord: v.valueRecord,
            [Symbol.iterator]: nextSetter,
          };
        }

        const {
          startOfSettersList,
          endOfSettersList,
          valueRecord,
        } = v as MapValueFilled<T>;

        const setterEntry: SettersListEntry<{
          isItFirstEntry: false;
          isItLastEntry: true;
        }> = {
          prev: (endOfSettersList as unknown) as SettersListEntry<{
            isItLastEntry: false;
          }>,
          next: undefined,
          setter,
        };

        ((endOfSettersList as unknown) as SettersListEntry<{
          isItLastEntry: false;
        }>).next = setterEntry;

        return {
          startOfSettersList,
          endOfSettersList: setterEntry,
          valueRecord,
          [Symbol.iterator]: nextSetter,
        };
      })<any>(mapValue);

      storeMap.set(key, newValue);
      return newValue.endOfSettersList;
    },

    removeSetter(key, setterEntry) {
      const mapValue = storeMap.get(key);
      if (!mapValue) {
        throwErrorKeyNotExist(key);
      }

      try {
        if (isMapValueEmpty(mapValue)) {
          throw new UseInterstateError(
            `It appears that the map value for the key ${key.toString()} has no setters to remove`
          );
        }
      } catch (error) {
        if (error instanceof UseInterstateError) {
          throw new UseInterstateError(
            `A severe inconsistency in recording setters for the key ${key.toString()} has been detected`
          );
        }

        throw error;
      }

      const { prev: connectNext, next: connectPrev } = setterEntry;
      const { startOfSettersList, endOfSettersList, valueRecord } = mapValue;

      let newStartOfSettersList = startOfSettersList;
      let newEndOfSettersList = endOfSettersList;

      if (setterEntry === startOfSettersList) {
        newStartOfSettersList = (connectPrev as unknown) as SettersListEntry<{
          isItFirstEntry: true;
        }>;
      } else {
        (connectNext as SettersListEntry).next = connectPrev;
      }

      if (setterEntry === endOfSettersList) {
        newEndOfSettersList = (connectNext as unknown) as SettersListEntry<{
          isItLastEntry: true;
        }>;
      } else {
        (connectPrev as SettersListEntry).prev = connectNext;
      }

      Object.assign(setterEntry, { prev: undefined, next: undefined });

      storeMap.set(key, {
        startOfSettersList: newStartOfSettersList,
        endOfSettersList: newEndOfSettersList,
        valueRecord,
        [Symbol.iterator]: nextSetter,
      });
    },

    triggerSetters(key, exceptSetterEntry) {
      const mapValue = storeMap.get(key);
      if (mapValue) {
        for (const setterEntry of mapValue) {
          if (setterEntry !== exceptSetterEntry) {
            setterEntry.setter(v => !v);
          }
        }
      }
    },

    getValue(key) {
      const mapValue = storeMap.get(key);
      if (!mapValue) {
        throwErrorKeyNotExist(key);
      }

      return (storeMap.get(key) as MapValue<any>).valueRecord;
    },

    setValue(key, value) {
      const mapValue = storeMap.get(key);
      if (!mapValue) {
        throwErrorKeyNotExist(key);
      }

      storeMap.set(key, {
        ...(storeMap.get(key) as MapValue<any>),
        valueRecord: value,
      });
    },
  };
}

export { storeFactory };
