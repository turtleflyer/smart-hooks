import { UseInterstateThrowError } from './errorHandle';

export type MapKey = string | number | symbol;

export type Setter = React.Dispatch<React.SetStateAction<boolean>>;

export interface SettersListEntry<
  C extends { isFirstEntry?: boolean; isLastEntry?: boolean } = {}
> {
  prev: C extends { isFirstEntry: true }
    ? undefined
    : C extends { isFirstEntry: false }
    ? SettersListEntry<{ isLastEntry: false }>
    : SettersListEntry<{ isLastEntry: false }> | undefined;

  next: C extends { isLastEntry: true }
    ? undefined
    : C extends { isLastEntry: false }
    ? SettersListEntry<{ isFirstEntry: false }>
    : SettersListEntry<{ isFirstEntry: false }> | undefined;

  setter: Setter;

  skipTriggering?: boolean;

  errorChunk?: boolean;
}

export type SettersListEntryFirst = SettersListEntry<{ isFirstEntry: true }>;
export type SettersListEntryLast = SettersListEntry<{ isLastEntry: true }>;
export type SettersListEntryFirstAndLast = SettersListEntry<{
  isFirstEntry: true;
  isLastEntry: true;
}>;
export interface SettersListEntryErrorChunk<C = {}> extends SettersListEntry<C> {
  errorChunk: true;
}

export type MapValueIterator = () => Iterator<SettersListEntry, undefined>;

type InitStatus = false | { readonly mustTrigger: boolean };

export interface MapValue<T> {
  startOfSettersList?: SettersListEntryFirst;
  endOfSettersList?: SettersListEntryLast;

  valueRecord?: T;
  valueWasSet?: boolean;

  initStatus: InitStatus;

  readonly [Symbol.iterator]: MapValueIterator;
}

export interface MapValueSubscribed<T> extends MapValue<T> {
  startOfSettersList: SettersListEntryFirst;
  endOfSettersList: SettersListEntryLast;
}

export interface MapValueNotSubscribed<T> extends MapValue<T> {
  startOfSettersList?: undefined;
  endOfSettersList?: undefined;
}

export interface MapValueActiveInitStatus<T> extends MapValue<T> {
  initStatus: Exclude<InitStatus, false>;
}

export type StoreMap = Map<MapKey, MapValue<unknown>>;

export interface SetterServiceMethods {
  readonly markSetterToSkip: () => void;
  readonly removeSetter: () => void;
}

export interface InitStateServiceMethods<T> {
  readonly getValue: () => T;
  readonly setValue: (value: T) => void;
  readonly triggerSetters: () => void;
  readonly checkInitStatus: () => InitStatus;
  readonly resetInitStatus?: () => void;
  readonly addSetter: (setter: Setter) => SetterServiceMethods;
}

type ExcludeUndefinedFromProperties<T> = {
  [P in keyof T]: Exclude<T[P], undefined>;
};
type ConstrainUndefined<T> = (T extends undefined ? T : never) extends never ? T : undefined;
type ConstrainUndefinedInProperties<T> = {
  [P in keyof T]: ConstrainUndefined<T[P]>;
};
type ExtractInitValueType<T extends { initValue: unknown } | undefined> = T extends undefined
  ? never
  : T extends { initValue: infer E }
  ? E
  : never;

export type InitStateMethod = <T, C extends { initValue: unknown } | undefined = undefined>(
  key: MapKey,
  conductInitValue?: C
) => C extends undefined
  ? ConstrainUndefinedInProperties<InitStateServiceMethods<T>>
  : ExtractInitValueType<C> extends T
  ? ExcludeUndefinedFromProperties<InitStateServiceMethods<ExtractInitValueType<C>>>
  : never;

export interface Store {
  throwError: UseInterstateThrowError;
  initState: InitStateMethod;
}
