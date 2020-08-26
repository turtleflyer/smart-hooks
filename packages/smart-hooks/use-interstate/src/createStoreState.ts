import type { TrueObjectAssign } from './CommonTypes';
import { createCyclesTask } from './createLifeCyclesTask';
import { createSettersList } from './createSettersList';
import type { StateKey } from './InterstateParam';
import type { MapValue } from './StoreMap';
import type { StoreState } from './StoreState';

export function createStoreState(): StoreState {
  const storeState: StoreState = {
    storeMap: new Map<StateKey, MapValue>(),
    memValuesMap: new Map<StateKey, { value: unknown } | undefined>(),
    settersWatchList: createSettersList({}),
    renderTask: createCyclesTask(
      () => ({}),
      () => {
        const { settersWatchList, effectTask } = storeState;

        // eslint-disable-next-line no-restricted-syntax
        for (const s of settersWatchList) {
          s.removeFromStore();
        }

        storeState.memValuesMap = new Map<StateKey, { value: unknown } | undefined>();
        effectTask.reset();

        (Object.assign as TrueObjectAssign)(settersWatchList, { start: undefined, end: undefined });
      }
    ),
    effectTask: createCyclesTask(
      () => ({}),
      () => {
        storeState.renderTask.reset();
      }
    ),
  };

  return storeState;
}
