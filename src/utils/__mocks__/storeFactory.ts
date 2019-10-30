import { Store as StoreT, StoreMap } from '../storeFactory';

const { Store }:
  { Store: typeof StoreT; }
  = jest.requireActual('../storeFactory.ts');

let lastStore: StoreMap;

class StoreForTest extends Store {
  constructor() {
    super();
    lastStore = this.storeMap;
  }
}

const bypassStoreFactory = () => new StoreForTest();
const getLastMap = () => lastStore;

export { bypassStoreFactory as storeFactory, getLastMap };
