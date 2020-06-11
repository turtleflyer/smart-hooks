import { createStoreState } from '../createStoreState';
import type { StateKey } from '../InterstateParam';
import type { StoreState } from '../StoreState';

let originalStoreState: StoreState;

const {
  createStoreState: originalCreateStoreState,
}: { createStoreState: typeof createStoreState } = jest.requireActual('../createStoreState.ts');

function mockedCreateStoreState(): StoreState {
  originalStoreState = originalCreateStoreState();

  return originalStoreState;
}

export function settersCounterFactory(): (key: StateKey) => number | undefined {
  const memStoreState = originalStoreState;

  return (key) => {
    const { storeMap } = memStoreState;
    const mapVal = storeMap.get(key);
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

export { mockedCreateStoreState as createStoreState };
