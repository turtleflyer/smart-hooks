import type { ErrorHandleOptions } from './errorHandle';
import { UseInterstateErrorCodes } from './errorHandle';
import type { SettersListBase } from './SettersLists';

export function isSettersListSubscribed<L extends SettersListBase>(
  v: L,
  { throwError, key }: ErrorHandleOptions
): v is L & { start: object; end: object } {
  const { start, end } = v;

  if (!start) {
    if (end) {
      throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
    }
    return false;
  }

  if (!end) {
    throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
  }

  return true;
}
