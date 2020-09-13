import { useRef, useState } from 'react';

type UnsealReadOnly<R extends object> = { [P in keyof R]: R[P] };

export type DeriveScheme<T> = { readonly [P in keyof T]: unknown };

export type FulfillTraversingKeys<S, K extends keyof S> = (p: S[K]) => void;

export function useTraverseKeys<
  S extends object,
  StateSideT extends DeriveScheme<S>,
  SettersSideT extends DeriveScheme<S>
>(
  scheme: S,
  eachKeyProceed: (
    key: keyof S,
    p: S,
    fulfillStateSide: FulfillTraversingKeys<StateSideT, keyof S>,
    fulfillSettersSide: FulfillTraversingKeys<SettersSideT, keyof S>
  ) => void
): Readonly<StateSideT> extends StateSideT
  ? Readonly<SettersSideT> extends SettersSideT
    ? [StateSideT, SettersSideT, (keyof S)[]]
    : never
  : never;

export function useTraverseKeys<
  S extends object,
  StateSideT extends DeriveScheme<S>,
  SettersSideT extends DeriveScheme<S>
>(
  scheme: S,
  eachKeyProceed: (
    key: keyof S,
    p: S,
    fulfillStateSide: FulfillTraversingKeys<StateSideT, keyof S>,
    fulfillSettersSide: FulfillTraversingKeys<SettersSideT, keyof S>
  ) => void
): [StateSideT, SettersSideT, (keyof S)[]] {
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

  const stateSide = {} as UnsealReadOnly<StateSideT>;
  const { current: settersSide } = useRef({} as UnsealReadOnly<SettersSideT>);
  enumKeys.forEach((key): void => {
    const fulfillStateSide: FulfillTraversingKeys<StateSideT, typeof key> = (p) => {
      stateSide[key] = p;
    };
    const fulfillSettersSide: FulfillTraversingKeys<SettersSideT, typeof key> = (p) => {
      settersSide[key] = p;
    };

    eachKeyProceed(key, memScheme, fulfillStateSide, fulfillSettersSide);
  });

  return [stateSide, settersSide, enumKeys];
}
