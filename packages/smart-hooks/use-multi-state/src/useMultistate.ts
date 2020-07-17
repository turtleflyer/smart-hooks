import React, { useMemo, useRef, useState } from 'react';
import type { UnsealReadOnly } from '../../../../common_types/UnsealReadOnly';

export type SettersObject<S extends object> = {
  readonly [P in keyof S]: React.Dispatch<React.SetStateAction<S[P]>>;
};

export type StateObject<S extends object> = { readonly [P in keyof S]: S[P] };

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

  const stateObject = {} as S;
  const { current: settersObject } = useRef({} as UnsealReadOnly<SettersObject<S>>);

  for (const key of enumKeys) {
    const [state, setter] = useState(memStateScheme[key]);
    stateObject[key] = state;
    settersObject[key] = setter;
  }

  return [stateObject, settersObject];
}
