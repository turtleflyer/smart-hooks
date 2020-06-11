import { createCyclesTask } from './createLifeCyclesTask';
import { createSettersList } from './createSettersList';
import type { StateKey } from './InterstateParam';
import type { MapValue } from './StoreMap';
import type { StoreState } from './StoreState';

export function createStoreState(): StoreState {
  const storeState: StoreState = {
    storeMap: new Map<StateKey, MapValue<any>>(),
    memValuesMap: new Map<StateKey, { value: any } | undefined>(),
    settersWatchList: createSettersList({}),
    renderTask: createCyclesTask(
      () => ({}),
      () => {
        const { settersWatchList, effectTask } = storeState;

        for (const s of settersWatchList) {
          s.removeFromStore();
        }

        storeState.memValuesMap = new Map<StateKey, { value: any } | undefined>();
        effectTask.reset();

        settersWatchList.start = undefined;
        settersWatchList.end = undefined;
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
