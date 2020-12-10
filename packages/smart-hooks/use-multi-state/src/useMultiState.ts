import React, { useState } from 'react';
import { useTraverseKeys } from '@smart-hooks/helper-traverse-scheme-keys';

export type SettersObject<S extends object> = {
  readonly [P in keyof S]: React.Dispatch<React.SetStateAction<S[P]>>;
};

export type StateObject<S extends object> = { readonly [P in keyof S]: S[P] };

export function useMultiState<S extends object>(
  stateScheme: S
): [StateObject<S>, SettersObject<S>] {
  const [stateObject, settersObject] = useTraverseKeys<S, StateObject<S>, SettersObject<S>>(
    stateScheme,
    (key, memStateScheme, stateObjectFulfill, settersObjectFulfill) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [state, setter] = useState(memStateScheme[key]);
      stateObjectFulfill(state);
      settersObjectFulfill(setter);
    }
  );

  return [stateObject, settersObject];
}
