export interface SettersListEntryBase {
  prev?: (SettersListEntryBase & { next: {} }) | undefined;
  next?: (SettersListEntryBase & { prev: {} }) | undefined;

  beenRemoved?: boolean;
}

export interface SettersWatchListEntry extends SettersListEntryBase {
  prev?: (SettersWatchListEntry & { next: {} }) | undefined;
  next?: (SettersWatchListEntry & { prev: {} }) | undefined;

  readonly removeFromStore: () => void;
}

export type SettersListIterator<
  L extends SettersListEntryBase = SettersListEntryBase
> = () => Iterator<L, undefined>;

export interface SettersListBase {
  start?: SettersListEntryBase & { prev: undefined };
  end?: SettersListEntryBase & { next: undefined };

  readonly [Symbol.iterator]: SettersListIterator;
}

export interface SettersWatchList extends SettersListBase {
  start?: SettersWatchListEntry & { prev: undefined };
  end?: SettersWatchListEntry & { next: undefined };

  readonly [Symbol.iterator]: SettersListIterator<SettersWatchListEntry>;
}
