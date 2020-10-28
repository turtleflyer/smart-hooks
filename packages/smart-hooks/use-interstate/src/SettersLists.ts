export interface SettersListEntryBase {
  prev?: (SettersListEntryBase & { next: object }) | undefined;
  next?: (SettersListEntryBase & { prev: object }) | undefined;

  beenRemoved?: boolean;
}

export interface SettersWatchListEntry extends SettersListEntryBase {
  prev?: (SettersWatchListEntry & { next: object }) | undefined;
  next?: (SettersWatchListEntry & { prev: object }) | undefined;

  readonly removeFromStore: () => void;
}

export interface SettersListBase {
  start?: SettersListEntryBase & { prev: undefined };
  end?: SettersListEntryBase & { next: undefined };
}

export interface SettersWatchList extends SettersListBase {
  start?: SettersWatchListEntry & { prev: undefined };
  end?: SettersWatchListEntry & { next: undefined };
}
