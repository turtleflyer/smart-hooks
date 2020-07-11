import React, { useMemo, useRef, useState } from 'react';

export type SettersObject<S extends object> = {
  readonly [P in keyof S]: React.Dispatch<React.SetStateAction<S[P]>>;
};

export type StateObject<S extends object> = { readonly [P in keyof S]: S[P] };

type UnsealReadOnly<R extends object> = { [P in keyof R]: R[P] };

export function useMultiState<S extends object>(
  stateScheme: S
): [StateObject<S>, SettersObject<S>] {
  const [memStateScheme] = useState(stateScheme);

  const enumKeys = useMemo(
    () => [
      ...Object.keys(memStateScheme),
      ...Object.getOwnPropertySymbols(memStateScheme).filter((key) =>
        memStateScheme.propertyIsEnumerable(key)
      ),
    ],
    []
  ) as Array<keyof S>;

  let stateObject = {} as S;
  const { current: settersObject } = useRef({} as UnsealReadOnly<SettersObject<S>>);

  for (const key of enumKeys) {
    const [state, setter] = useState(memStateScheme[key]);
    stateObject[key] = state;
    settersObject[key] = setter;
  }

  return [stateObject as StateObject<S>, settersObject as SettersObject<S>];
}
