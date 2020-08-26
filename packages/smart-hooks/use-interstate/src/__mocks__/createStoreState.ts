import { createStoreState } from '../createStoreState';
import type { StateKey } from '../InterstateParam';
import type { StoreState } from '../StoreState';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-restricted-syntax
    for (const _ of mapVal) {
      count++;
    }

    return count;
  };
};

export { mockedCreateStoreState as createStoreState };
