type TrueObjectAssign = <T extends object, U extends Partial<T>>(target: T, source: U) => T & U;

export interface FlagManager<T> {
  reset: () => void;
  set: (newFlags: Partial<T>) => void;
  read: <F extends keyof T>(flag: F) => T[F];
}

export function createFlagManager<T extends object>(flags: T, def: T): FlagManager<T> {
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
  };
}
