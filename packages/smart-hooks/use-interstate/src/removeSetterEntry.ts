import type { TrueObjectAssign } from './CommonTypes';
import type { ErrorHandleOptions } from './errorHandle';
import { UseInterstateErrorCodes } from './errorHandle';
import { isSettersListSubscribed } from './isSettersListSubscribed';
import type { SettersListBase, SettersListEntryBase } from './SettersLists';

declare function fixControlFlowAnalysis(): never;

export function removeSetterEntry<E extends SettersListEntryBase, L extends SettersListBase>(
  entry: E,
  list: L,
  { throwError, key }: ErrorHandleOptions
): L extends { start?: infer EP }
  ? EP extends infer ET & { prev: undefined }
    ? E extends ET
      ? void
      : never
    : never
  : never;

export function removeSetterEntry(
  entry: SettersListEntryBase,
  list: SettersListBase,
  { throwError, key }: ErrorHandleOptions
): void {
  function closeSettersListEndpoint<
    EE extends SettersListEntryBase & ({ prev: undefined } | { next: undefined }),
    S extends 'prev' | 'next'
  >(
    endpoint: EE,
    sideKey: S
  ): EE extends SettersListEntryBase & { prev: undefined }
    ? S extends 'next'
      ? (SettersListEntryBase & { prev: undefined }) | undefined
      : never
    : S extends 'prev'
    ? (SettersListEntryBase & { next: undefined }) | undefined
    : never;

  function closeSettersListEndpoint(
    endpoint: SettersListEntryBase & ({ prev: undefined } | { next: undefined }),
    sideKey: 'prev' | 'next'
  ): (SettersListEntryBase & ({ prev: undefined } | { next: undefined })) | undefined {
    if (entry === endpoint) {
      return entry[sideKey] as SettersListEntryBase & ({ prev: undefined } | { next: undefined });
    }

    const neighbor = entry[sideKey === 'prev' ? 'next' : 'prev'];
    if (!neighbor) {
      throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
      fixControlFlowAnalysis();
    }

    (neighbor[sideKey] as SettersListEntryBase | undefined) = entry[sideKey];

    return endpoint;
  }

  if (entry.beenRemoved) {
    return;
  }

  if (!isSettersListSubscribed(list, { throwError })) {
    throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
    fixControlFlowAnalysis();
  }

  const { start, end } = list;

  (Object.assign as TrueObjectAssign)(list as SettersListBase, {
    start: closeSettersListEndpoint(start, 'next'),
    end: closeSettersListEndpoint(end, 'prev'),
  });

  // eslint-disable-next-line no-param-reassign
  entry.beenRemoved = true;
}
