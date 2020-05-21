export interface ExecutionCounter {
  howManyTimesBeenCalled(): number;
  count(): void;
  reset(): void;
}

export function executionCountersFactory(): ExecutionCounter {
  const store = {
    counter: 0,
  };
  return {
    howManyTimesBeenCalled() {
      return store.counter;
    },

    count() {
      store.counter++;
    },

    reset() {
      store.counter = 0;
    },
  };
}
