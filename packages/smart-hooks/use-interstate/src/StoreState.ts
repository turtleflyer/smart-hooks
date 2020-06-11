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

export interface SetterServices {
  readonly removeSetterFromKeyList: () => void;
  readonly removeSetterFromWatchList: () => void;
}

export interface StoreServices<T> {
  readonly getValue: () => T;
  readonly setValue: (value: InterstateParam<T>) => void;
  readonly resetInitState?: () => void;
  readonly addSetter: (setter: Setter) => SetterServices | void;
}

export interface ConductInitValue<T> {
  readonly initValue: InterstateInitializeParam<T>;
  readonly signature: symbol;
}

export type InitializeState = <T>(
  key: StateKey,
  conductInitValue?: ConductInitValue<T>
) => StoreServices<T>;

export interface Store {
  readonly initializeState: InitializeState;
  readonly runRenderTask: (key: StateKey) => void;
  readonly runEffectTask: () => void;
}
