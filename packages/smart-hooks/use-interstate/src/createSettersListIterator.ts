import type { SettersListBase, SettersListEntryBase, SettersListIterator } from './SettersLists';

export function createSettersListIterator<L extends Omit<SettersListBase, never>>(
  v: L
): L extends { start?: infer S }
  ? S extends infer E & { prev: undefined }
    ? SettersListIterator<E>
    : never
  : never;

export function createSettersListIterator(v: Omit<SettersListBase, never>): SettersListIterator {
  return function mapValueIterator() {
    let entry = v.start as SettersListEntryBase | undefined;

    return {
      next() {
        if (entry) {
          const curEntry = entry;
          entry = entry.next as SettersListEntryBase | undefined;
          return { value: curEntry, done: false };
        }

        return { value: undefined, done: true };
      },
    };
  };
}
