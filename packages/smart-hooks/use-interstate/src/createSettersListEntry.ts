import { UseInterstateErrorCodes } from './errorHandle';
import type { ErrorHandleOptions } from './errorHandle';
import type { SettersListBase, SettersListEntryBase } from './SettersLists';

export function createSettersListEntry<O extends SettersListEntryBase, L extends SettersListBase>(
  entryProps: O,
  list: L,
  { throwError, key }: ErrorHandleOptions
): L extends { start?: infer EP }
  ? EP extends infer E & { prev: undefined }
    ? ((p: E) => E) extends (p: O) => O
      ? E
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
    prev: end as (SettersListEntryBase & { next: object }) | undefined,
    next: undefined,
  };

  // eslint-disable-next-line no-param-reassign
  list.end = entry;
  if (end) {
    (end as SettersListEntryBase).next = entry as SettersListEntryBase & { prev: object };
  } else {
    // eslint-disable-next-line no-param-reassign
    list.start = entry as SettersListEntryBase & { prev: undefined };
  }

  return entry;
}
