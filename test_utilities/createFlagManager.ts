function createFlagManager<T extends {}>(flags: T, def: T) {
  return {
    reset() {
      Object.assign(flags, def);
    },

    set<F extends keyof T>(flag: F, value: T[F]) {
      flags[flag] = value;
    },

    read<F extends keyof T>(flag: F) {
      return flags[flag];
    },
  };
}

export { createFlagManager };
