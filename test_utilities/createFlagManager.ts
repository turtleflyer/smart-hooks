type TrueObjectAssign = <T, U extends Partial<T>>(target: T, source: U) => T & U;

export interface FlagManager<T> {
  reset: () => void;
  set: <A extends T>(newFlags: A) => void;
  read: <F extends keyof T>(flag: F) => T[F];
}

export function createFlagManager<T>(flags: T, def: T) {
  return {
    reset() {
      (Object.assign as TrueObjectAssign)(flags, def);
    },

    set(newFlags) {
      (Object.assign as TrueObjectAssign)(flags, newFlags);
    },

    read(flag) {
      return flags[flag];
    },
  } as FlagManager<T>;
}
