export interface FlagManager<T> {
  reset: () => void;
  set: <A extends object>(newFlags: A) => T extends A ? void : never;
  read: <F extends keyof T>(flag: F) => T[F];
}

export function createFlagManager<T>(flags: T, def: T) {
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
  } as FlagManager<T>;
}
