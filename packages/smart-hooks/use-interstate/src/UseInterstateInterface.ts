import type { Dispatch, FC, SetStateAction } from 'react';

export type StateKey = string | number | symbol;

export type Setter = Dispatch<SetStateAction<boolean>>;

export type InterstateParam<T extends unknown> =
  | Exclude<T, (...arg: never[]) => unknown>
  | ((prevValue: T) => T);

export type InterstateInitializeParam<T extends unknown> = T extends undefined
  ? () => undefined | void
  : Exclude<T, (...arg: never[]) => unknown | undefined | void> | (() => T);

export type UseInterstateInitializeObject<S extends object> = {
  readonly [P in keyof S]: InterstateInitializeParam<S[P]> | undefined;
};

export type SetInterstate<T extends unknown = unknown> = (p: InterstateParam<T>) => void;

export type UseInterstateSettersObject<
  S extends object,
  M extends object = S
> = keyof S extends keyof M ? { readonly [P in keyof S]: SetInterstate<M[P]> } : never;

export type UseInterstateStateObject<
  S extends object,
  M extends object = S
> = keyof S extends keyof M ? { readonly [P in keyof S]: M[P] } : never;

export interface UseInterstate<M extends object = object> {
  <T extends undefined & (keyof M extends never ? unknown : never)>(key: StateKey, initValue: T): [
    () => unknown,
    SetInterstate<unknown>
  ];

  <
    S extends Partial<M> &
      (keyof M extends never ? unknown : keyof S extends keyof M ? unknown : never)
  >(
    stateScheme: UseInterstateInitializeObject<S>
  ): keyof M extends never
    ? [() => UseInterstateStateObject<S, S>, UseInterstateSettersObject<S, S>]
    : [() => UseInterstateStateObject<S, M>, UseInterstateSettersObject<S, M>];

  <K extends keyof M, T extends M[K] = M[K]>(key: K, initValue?: InterstateInitializeParam<T>): [
    () => M[K],
    SetInterstate<M[K]>
  ];

  <T extends keyof M extends never ? unknown : never>(
    key: StateKey,
    initValue?: InterstateInitializeParam<T>
  ): T[] extends void[] ? [() => undefined, SetInterstate<undefined>] : [() => T, SetInterstate<T>];
}

export interface GetUseInterstate {
  <M extends object = object>(): { Scope: FC; useInterstate: UseInterstate<M> };
}
