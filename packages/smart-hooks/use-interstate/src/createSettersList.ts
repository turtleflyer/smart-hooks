import type { TrueObjectAssign } from './CommonTypes';
import { createSettersListIterator } from './createSettersListIterator';
import type { ErrorHandleOptions } from './errorHandle';
import { UseInterstateErrorCodes } from './errorHandle';
import type { SettersListBase } from './SettersLists';

export function createSettersList<
  L extends SettersListBase,
  O extends Omit<L, never> = Omit<L, never>
>(props: O, errOptions?: ErrorHandleOptions): L;

export function createSettersList(
  props: Omit<SettersListBase, never>,
  errOptions?: ErrorHandleOptions
): SettersListBase {
  const { start, end } = props;
  if ((!start && end) || (start && !end)) {
    if (errOptions) {
      const { throwError, key } = errOptions;
      throwError(UseInterstateErrorCodes.UNEXPECTED_ERROR, { key });
    }
    throw Error('Uncaught error occurs in useInterstate');
  }

  const list = { ...props } as SettersListBase;

  return (Object.assign as TrueObjectAssign)(list, {
    [Symbol.iterator]: createSettersListIterator(list),
  });
}
