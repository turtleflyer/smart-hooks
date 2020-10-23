declare function useSmartMemo<T extends unknown>(factory: () => T, deps: ReadonlyArray<unknown>): T;
export { useSmartMemo };
