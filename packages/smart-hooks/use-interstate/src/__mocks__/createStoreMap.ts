import { MapKey, StoreMap } from '../StoreMap';

let storeMap: StoreMap;

export function createStoreMap(): StoreMap {
  storeMap = <StoreMap>new Map();
  return storeMap;
}

export function settersCounterFactory(): (key: MapKey) => number | undefined {
  const memMap = storeMap;

  return (key) => {
    const mapVal = memMap.get(key);
    if (mapVal === undefined) {
      return undefined;
    }

    let count = 0;
    for (const _ of mapVal) {
      count++;
    }

    return count;
  };
}
