export interface FlagManager<T> {
  reset: () => void;
  set: (newFlags: Partial<T>) => void;
  read: <F extends keyof T>(flag: F) => T[F];
}

export function createFlagManager<T extends object>(flags: T, def: T): FlagManager<T> {
  return {
    reset() {
      Object.assign(flags, def);
    },

    set(newFlags) {
      Object.assign(flags, newFlags);
    },

    read(flag) {
      return flags[flag];
    },
  };
}
