import { createStoreState } from '../createStoreState';
import type { MapValueSettersListEntry } from '../StoreMap';
import type { StoreState } from '../StoreState';
import type { StateKey } from '../UseInterstateInterface';

const originalStoreState: StoreState[] = [];

const {
  createStoreState: originalCreateStoreState,
}: { createStoreState: typeof createStoreState } = jest.requireActual('../createStoreState.ts');

function mockedCreateStoreState(): StoreState {
  originalStoreState.unshift(originalCreateStoreState());

  return originalStoreState[0];
}

export type SettersCounterFactory = (n?: number) => (key: StateKey) => number | undefined;

export const settersCounterFactory: SettersCounterFactory = (n = 0) => {
  const memStoreState = originalStoreState[n];

  return (key) => {
    const { storeMap } = memStoreState;
    const mapVal = storeMap.get(key);
    if (mapVal === undefined) {
      return undefined;
    }

    let count = 0;
    let setterEntry: MapValueSettersListEntry | undefined = mapVal.start;
    while (setterEntry) {
      count++;
      setterEntry = setterEntry.next;
    }

    return count;
  };
};

export { mockedCreateStoreState as createStoreState };
