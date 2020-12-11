import type { UseEachKeyProceed } from '@smart-hooks/helper-traverse-scheme-keys';
import { useTraverseKeys } from '@smart-hooks/helper-traverse-scheme-keys';
import React, { useState } from 'react';

export type InitStateObject<S extends object> = { readonly [P in keyof S]: S[P] | (() => S[P]) };

export type SettersObject<S extends object> = {
  [P in keyof S]: React.Dispatch<React.SetStateAction<S[P]>>;
};

export function useMultiState<S extends object>(
  initState: InitStateObject<S>
): [S, SettersObject<S>] {
  const useMultiStateTraverse: UseEachKeyProceed<InitStateObject<S>, S, SettersObject<S>> = (
    key,
    memInitState,
    stateObjectFulfill,
    settersObjectFulfill
  ) => {
    const [state, setter] = useState<S[keyof S]>(memInitState[key]);

    stateObjectFulfill(state);
    settersObjectFulfill(setter);
  };
  const [stateObject, settersObject] = useTraverseKeys(initState, useMultiStateTraverse);

  return [stateObject, settersObject];
}
