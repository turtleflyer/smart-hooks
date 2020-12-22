import { FlagManager } from './createFlagManager';

type UseMemo = <T extends unknown>(factory: () => T, deps: ReadonlyArray<unknown> | undefined) => T;

function mockReactUseMemo<
  R extends { useMemo: UseMemo },
  T extends { MOCK_USE_MEMO: boolean; PROOF_OF_MOCK: 'mocked' | 'original' }
>(reactExport: R, flagManager: FlagManager<T>): R {
  const { useMemo } = reactExport;

  const mockUseMemo: UseMemo = (factory, deps) => {
    if (flagManager.read('MOCK_USE_MEMO')) {
      flagManager.set({ PROOF_OF_MOCK: 'mocked' } as Readonly<T>);
      return factory();
    }
    flagManager.set({ PROOF_OF_MOCK: 'original' } as Readonly<T>);
    // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
    return useMemo(factory, deps);
  };

  return { ...reactExport, useMemo: mockUseMemo };
}

export { mockReactUseMemo };
