export type MapKey = string | number | symbol;
type Setters = Array<React.Dispatch<React.SetStateAction<boolean>>>;

interface MapValue {
  setters: Setters;
  value?: any;
}

type StoreMap = Map<MapKey, MapValue>;

export interface Store {
  getStoreMap(): StoreMap;
  initEntry(key: MapKey): void;
  addSetter(
    key: MapKey,
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ): void;
  removeSetter(
    key: MapKey,
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ): void;
  triggerSetters(key: MapKey): void;
  getValue(key: MapKey): any;
  setValue(key: MapKey, value: any): void;
}

function getMapValueCheckInitialized(map: StoreMap, key: MapKey) {
  const mapValue = map.get(key);
  if (!mapValue) {
    throw new Error(
      `useIntestate: The entry has never been initialized for the key "${key.toString()}"`
    );
  }
  return mapValue;
}

function storeFactory(): Store {
  const state: { storeMap: StoreMap } = { storeMap: new Map() };

  return {
    getStoreMap: () => state.storeMap,

    initEntry(key) {
      const { storeMap } = state;
      if (!storeMap.has(key)) {
        const createValue = { setters: [] };
        storeMap.set(key, createValue);
      }
    },

    addSetter(key, setter) {
      const { setters } = getMapValueCheckInitialized(state.storeMap, key);
      setters.push(setter);
    },

    removeSetter(key, setter) {
      const { setters } = getMapValueCheckInitialized(state.storeMap, key);
      setters.splice(setters.indexOf(setter), 1);
    },

    triggerSetters(key) {
      const { setters } = state.storeMap.get(key) as MapValue;
      setters.forEach(callback => {
        callback(v => !v);
      });
    },

    getValue(key) {
      const storeMapValue = getMapValueCheckInitialized(state.storeMap, key);
      return storeMapValue.value;
    },

    setValue(key, value) {
      const storeMapValue = getMapValueCheckInitialized(state.storeMap, key);
      storeMapValue.value = value;
    },
  };
}

export { storeFactory };
