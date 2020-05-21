export interface FlagManager<T> {
  reset: () => void;
  set: <F extends keyof T>(flag: F, value: T[F]) => void;
  read: <F extends keyof T>(flag: F) => T[F];
}

export function createFlagManager<T extends {}>(flags: T, def: T): FlagManager<T> {
  return {
    reset() {
      Object.assign(flags, def);
    },

    set(flag, value) {
      flags[flag] = value;
    },

    read(flag) {
      return flags[flag];
    },
  };
}
