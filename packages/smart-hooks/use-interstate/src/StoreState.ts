import type { UseInterstateThrowError } from './errorHandle';
import type {
  InterstateInitializeParam,
  InterstateParam,
  Setter,
  StateKey,
} from './UseInterstateInterface';
import type { StoreMapEffectTask, StoreRenderTask } from './LifeCyclesTasks';
import type { SettersWatchList } from './SettersLists';
import type { StoreMap } from './StoreMap';

export type MemValueMap = Map<StateKey, { value: unknown } | undefined>;

export interface StoreState {
  readonly storeMap: StoreMap;
  memValuesMap: MemValueMap;
  readonly settersWatchList: SettersWatchList;
  readonly renderTask: StoreRenderTask;
  readonly effectTask: StoreMapEffectTask;
}

export interface SetterMethods {
  readonly removeSetterFromKeyList: () => void;
  readonly removeSetterFromWatchList: () => void;
}

export interface StoreMethods<T extends unknown> {
  readonly getValue: () => T;
  readonly setValue: (value: InterstateParam<T>) => void;
  readonly addSetter: (setter: Setter) => SetterMethods | null;
}

export type InitializeState = <T extends unknown>(
  key: StateKey,
  initValue: InterstateInitializeParam<T> | undefined
) => StoreMethods<T>;

export interface Store {
  readonly initializeState: InitializeState;
  readonly runRenderTask: (key: StateKey) => void;
  readonly runEffectTask: () => void;
  readonly throwError: UseInterstateThrowError;
}
