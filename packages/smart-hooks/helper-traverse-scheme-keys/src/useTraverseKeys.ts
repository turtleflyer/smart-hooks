import { useRef, useState } from 'react';

export function useTraverseKeys<
  S extends object,
  StateSide extends Record<keyof S, unknown>,
  SettersSide extends Record<keyof S, unknown>
>(
  scheme: S,
  eachKeyProceed: (
    key: keyof S,
    p: S,
    fulfillStateSide: (p: StateSide[keyof S]) => void,
    fulfillSettersSide: (p: SettersSide[keyof S]) => void
  ) => void
): [StateSide, SettersSide, (keyof S)[]] {
  const [[memScheme, enumKeys]] = useState(
    () =>
      [
        scheme,
        [
          ...Object.keys(scheme),
          ...Object.getOwnPropertySymbols(scheme).filter((key) =>
            Object.prototype.propertyIsEnumerable.call(scheme, key)
          ),
        ],
      ] as [S, (keyof S)[]]
  );

  const stateSide = {} as StateSide;
  const { current: settersSide } = useRef({} as SettersSide);
  enumKeys.forEach((key): void => {
    const fulfillStateSide: (p: StateSide[keyof S]) => void = (p) => {
      stateSide[key] = p;
    };
    const fulfillSettersSide: (p: SettersSide[keyof S]) => void = (p) => {
      settersSide[key] = p;
    };

    eachKeyProceed(key, memScheme, fulfillStateSide, fulfillSettersSide);
  });

  return [stateSide, settersSide, enumKeys];
}
