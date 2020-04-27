import { Store, MapKey } from '../storeFactory';

const { storeFactory }: { storeFactory: () => Store } = jest.requireActual(
  '../storeFactory.ts'
);

let memCountMap: { countMap: Map<MapKey, number> };

const bypassStoreFactory: () => Store = () => {
  const store = storeFactory();
  const { addSetter, removeSetter } = store;
  const countMap = new Map<MapKey, number>();

  memCountMap = { countMap };

  const newAddSetter: typeof addSetter = (key, setter) => {
    const count = countMap.get(key);
    countMap.set(key, (count || 0) + 1);
    return addSetter(key, setter);
  };

  const newRemoveSetter: typeof removeSetter = (key, setterEntry) => {
    const count = countMap.get(key);
    countMap.set(key, (count as number) - 1);
    return removeSetter(key, setterEntry);
  };

  return { ...store, addSetter: newAddSetter, removeSetter: newRemoveSetter };
};

function getCountSetters(): (key: MapKey) => number | undefined {
  const { countMap } = memCountMap;
  return key => countMap.get(key) || 0;
}
export { bypassStoreFactory as storeFactory, getCountSetters };
