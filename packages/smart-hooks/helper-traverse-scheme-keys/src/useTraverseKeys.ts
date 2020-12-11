import { useRef, useState } from 'react';

export type UseTraverseReturn<
  S extends object,
  StateSide extends Record<keyof S, unknown> = Record<keyof S, unknown>,
  SettersSide extends Record<keyof S, unknown> = Record<keyof S, unknown>
> = [StateSide, SettersSide, (keyof S)[]];

export type UseEachKeyProceed<
  S extends object,
  StateSide extends Record<keyof S, unknown>,
  SettersSide extends Record<keyof S, unknown>
> = (
  key: keyof S,
  memScheme: S,
  fulfillStateSide: (p: StateSide[keyof S]) => void,
  fulfillSettersSide: (p: SettersSide[keyof S]) => void
) => void;

export function useTraverseKeys<
  S extends object,
  StateSide extends Record<keyof S, unknown>,
  SettersSide extends Record<keyof S, unknown>
>(
  scheme: S,
  useEachKeyProceed: UseEachKeyProceed<S, StateSide, SettersSide>
): UseTraverseReturn<S, StateSide, SettersSide> {
  const [[memScheme, memEnumKeys]] = useState(
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
  const { current: memSettersSide } = useRef({
    firstRun: true,
    settersSide: {} as SettersSide,
  });

  memEnumKeys.forEach((key): void => {
    const fulfillStateSide: (p: StateSide[keyof S]) => void = (p) => {
      stateSide[key] = p;
    };
    const fulfillSettersSide: (p: SettersSide[keyof S]) => void = memSettersSide.firstRun
      ? (p) => {
          memSettersSide.settersSide[key] = p;
        }
      : () => {};

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEachKeyProceed(key, memScheme, fulfillStateSide, fulfillSettersSide);
  });

  return [stateSide, memSettersSide.settersSide, memEnumKeys];
}
