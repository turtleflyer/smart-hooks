import { UseInterstateErrorCodes } from './errorHandle';
import type { ErrorHandleOptions } from './errorHandle';
import type { SettersListBase, SettersListEntryBase } from './SettersLists';

export function createSettersListEntry<O extends SettersListEntryBase, L extends SettersListBase>(
  entryProps: O,
  list: L,
  { throwError, key }: ErrorHandleOptions
): L extends { start?: infer EP }
  ? EP extends infer E & { prev: undefined }
    ? E extends O
      ? O extends E
        ? E
        : never
      : never
    : never
  : never;

export function createSettersListEntry(
  entryProps: SettersListEntryBase,
  list: SettersListBase,
  { throwError, key }: ErrorHandleOptions
): SettersListEntryBase {
  const { start, end } = list;

  if ((!start && end) || (start && !end)) {
    throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
  }

  const entry: SettersListEntryBase & { next: undefined } = {
    ...entryProps,
    prev: <(SettersListEntryBase & { next: {} }) | undefined>end,
    next: undefined,
  };

  list.end = entry;
  if (end) {
    (<SettersListEntryBase>end).next = <SettersListEntryBase & { prev: {} }>entry;
  } else {
    list.start = <SettersListEntryBase & { prev: undefined }>entry;
  }

  return entry;
}
