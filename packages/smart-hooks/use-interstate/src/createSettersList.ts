import { createSettersListIterator } from './createSettersListIterator';
import { UseInterstateErrorCodes } from './errorHandle';
import type { ErrorHandleOptions } from './errorHandle';
import type { SettersListBase, SettersListEntryBase, SettersListIterator } from './SettersLists';

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

  const list = { ...props };

  const mergeWithIterator: {
    [Symbol.iterator]: SettersListIterator<SettersListEntryBase>;
  } = {
    [Symbol.iterator]: createSettersListIterator(<SettersListBase>list),
  };

  return Object.assign(list, mergeWithIterator);
}
