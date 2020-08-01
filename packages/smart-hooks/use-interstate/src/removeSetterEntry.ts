import { fixControlFlowAnalysis } from './CommonTypes';
import type { TrueObjectAssign } from './CommonTypes';
import { UseInterstateErrorCodes } from './errorHandle';
import type { ErrorHandleOptions } from './errorHandle';
import type { SettersListBase, SettersListEntryBase } from './SettersLists';

function isSettersListSubscribed<L extends SettersListBase>(
  v: L,
  { throwError, key }: ErrorHandleOptions
): v is L & { start: object; end: object } {
  const { start, end } = v;

  if (!start) {
    if (end) {
      throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
    }
    return false;
  } else if (!end) {
    throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
  }

  return true;
}

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
    } else {
      const neighbor = entry[sideKey === 'prev' ? 'next' : 'prev'];
      if (!neighbor) {
        throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
        fixControlFlowAnalysis();
      }

      (<SettersListEntryBase | undefined>neighbor[sideKey]) = entry[sideKey];

      return endpoint;
    }
  }

  if (entry.beenRemoved) {
    return;
  }

  if (!isSettersListSubscribed(list, { throwError })) {
    throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
    fixControlFlowAnalysis();
  }

  const { start, end } = list;

  (Object.assign as TrueObjectAssign)(list, {
    start: closeSettersListEndpoint(start, 'next'),
    end: closeSettersListEndpoint(end, 'prev'),
  });

  entry.beenRemoved = true;
}
