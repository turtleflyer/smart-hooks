import { Store } from '../storeFactory';

const { storeFactory }: { storeFactory: () => Store } = jest.requireActual('../storeFactory.ts');

let lastMap: Map<any, any>;

const bypassStoreFactory = () => {
  const store = storeFactory();
  lastMap = store.getStoreMap();
  return store;
};

const getLastMap = () => lastMap;

export { bypassStoreFactory as storeFactory, getLastMap };
