function useMemo<T>(
  factory: () => T,
  // tslint:disable-next-line: variable-name
  _deps: ReadonlyArray<any> | undefined,
) {
  return factory();
}

const react = jest.requireActual('react');
module.exports = { ...react, useMemo };
