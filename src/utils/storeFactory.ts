import react from 'react';

type MapKey = string | number | symbol;

interface MapEntry {
  setters: Array<React.Dispatch<React.SetStateAction<boolean>>>;
  value?: any;
}

type StoreMap = Map<MapKey, MapEntry>;

class Store {
  storeMap: StoreMap = new Map<MapKey, MapEntry>();

  get(key: MapKey) {
    return (this.storeMap.get(key) !== undefined
      || this.storeMap.set(key, { setters: [] }))
      && this.storeMap.get(key) as MapEntry;
  }

  set(id: MapKey, value: MapEntry) {
    this.storeMap.set(id, value);
  }

}

const storeFactory = () => new Store();

export { storeFactory, Store, StoreMap, MapKey };
