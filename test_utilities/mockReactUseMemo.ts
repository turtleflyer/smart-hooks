import { FlagManager } from './createFlagManager';

type UseMemo = <T>(factory: () => T, deps: ReadonlyArray<any> | undefined) => T;

function mockReactUseMemo<
  T extends { MOCK_USE_MEMO: boolean; PROOF_OF_MOCK: string }
>(reactExport: { useMemo: UseMemo }, flagManager: FlagManager<T>) {
  const { useMemo } = reactExport;

  function mockUseMemo<R>(
    factory: () => R,
    deps: ReadonlyArray<any> | undefined,
  ) {
    if (flagManager.read('MOCK_USE_MEMO')) {
      flagManager.set('PROOF_OF_MOCK', 'mocked');
      return factory();
    } else {
      flagManager.set('PROOF_OF_MOCK', 'original');
      // tslint:disable-next-line: react-hooks-nesting
      return useMemo(factory, deps);
    }
  }

  return { ...reactExport, useMemo: mockUseMemo };
}

export { mockReactUseMemo };
