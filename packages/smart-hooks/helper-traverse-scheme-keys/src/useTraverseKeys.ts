import { useRef, useState } from 'react';

type UnsealReadOnly<R extends object> = { [P in keyof R]: R[P] };

export type DeriveScheme<T> = { readonly [P in keyof T]: any };

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
          ...Object.getOwnPropertySymbols(scheme).filter((key) => scheme.propertyIsEnumerable(key)),
        ],
      ] as [S, (keyof S)[]]
  );

  type SidesTuple = [UnsealReadOnly<StateSideT>, UnsealReadOnly<SettersSideT>];

  return [
    ...enumKeys.reduce(
      ([stateSide, settersSide], key): SidesTuple => {
        const fulfillStateSide: FulfillTraversingKeys<StateSideT, typeof key> = (p) => {
          stateSide[key] = p;
        };
        const fulfillSettersSide: FulfillTraversingKeys<SettersSideT, typeof key> = (p) => {
          settersSide[key] = p;
        };

        eachKeyProceed(key, memScheme, fulfillStateSide, fulfillSettersSide);

        return [stateSide, settersSide];
      },
      [{}, useRef({}).current] as SidesTuple
    ),
    enumKeys,
  ];
}
