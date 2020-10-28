import type { TrueObjectAssign } from './CommonTypes';
import { createCyclesTask } from './createLifeCyclesTask';
import type { SettersWatchListEntry } from './SettersLists';
import type { MapValue } from './StoreMap';
import type { StoreState } from './StoreState';
import type { StateKey } from './UseInterstateInterface';

export function createStoreState(): StoreState {
  const storeState: StoreState = {
    storeMap: new Map<StateKey, MapValue>(),
    memValuesMap: new Map<StateKey, { value: unknown } | undefined>(),
    settersWatchList: {},
    renderTask: createCyclesTask(
      () => ({}),
      () => {
        const { settersWatchList, effectTask } = storeState;

        let setterEntry: SettersWatchListEntry | undefined = settersWatchList.start;
        while (setterEntry) {
          setterEntry.removeFromStore();
          setterEntry = setterEntry.next;
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
