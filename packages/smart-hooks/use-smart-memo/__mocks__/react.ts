import { flagManager } from '../__tests__/testFlags';
const react = jest.requireActual('react');
const { useMemo } = react;

function mockUseMemo<T>(
  factory: () => T,
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

module.exports = { ...react, useMemo: mockUseMemo };
