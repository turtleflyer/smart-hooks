import type {
  InterstateInitializeParam,
  InterstateParam,
  Setter,
  StateKey,
} from './InterstateParam';
import type { StoreMapEffectTask, StoreRenderTask } from './LifeCyclesTasks';
import type { SettersWatchList } from './SettersLists';
import type { StoreMap } from './StoreMap';

export type MemValueMap = Map<StateKey, { value: any } | undefined>;

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

export interface StoreMethods<T> {
  readonly getValue: () => T;
  readonly setValue: (value: InterstateParam<T>) => void;
  readonly addSetter: (setter: Setter) => SetterMethods | void;
}

export interface ConductInitValue<T> {
  readonly value: InterstateInitializeParam<T>;
}

export type InitializeState = <T>(
  key: StateKey,
  conductInitValue?: ConductInitValue<T>
) => StoreMethods<T>;

export interface Store {
  readonly initializeState: InitializeState;
  readonly runRenderTask: (key: StateKey) => void;
  readonly runEffectTask: () => void;
}
