import type { UseInterstateErrorCodes } from './errorHandle';
import type { SettersListBase, SettersListEntryBase } from './SettersLists';
import type { Setter, StateKey } from './UseInterstateInterface';

export interface MapValueSettersListEntry extends SettersListEntryBase {
  prev?: (MapValueSettersListEntry & { next: object }) | undefined;
  next?: (MapValueSettersListEntry & { prev: object }) | undefined;

  readonly setter: Setter;

  readonly removeFromWatchList: () => void;

  errorChunk: boolean;
}

export function isSetterListEntryErrorChunk(
  e: MapValueSettersListEntry | undefined
): e is MapValueSettersListEntry & { errorChunk: true } {
  return !!e?.errorChunk;
}

type InitStatus<T extends unknown> = { readonly value: T };

export interface MapValue<T extends unknown = unknown> extends SettersListBase {
  start?: MapValueSettersListEntry & { prev: undefined };
  end?: MapValueSettersListEntry & { next: undefined };

  value?: T;
  isValueSetUp: boolean;

  caughtError?: UseInterstateErrorCodes;

  initStatus?: InitStatus<T>;

  triggerRegistered?: boolean;
}

export type StoreMap = Map<StateKey, MapValue>;
