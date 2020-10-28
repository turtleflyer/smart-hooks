import type { Dispatch, FC, SetStateAction } from 'react';

export type StateKey = string | number | symbol;

export type Setter = Dispatch<SetStateAction<object>>;

export type InterstateParam<T extends unknown> =
  | Exclude<T, (...arg: never[]) => unknown>
  | ((prevValue: T) => T);

export type InterstateInitializeParam<T extends unknown> = T extends undefined
  ? () => undefined | void
  : Exclude<T, (...arg: never[]) => unknown | undefined | void> | (() => T);

export type SetInterstate<T extends unknown = unknown> = (p: InterstateParam<T>) => void;

export type InterstateStateObject<M extends object, K extends keyof M = keyof M> = {
  readonly [P in K]: M[P];
};

export type InterstateInitializeObject<M extends object, K extends keyof M = keyof M> = {
  readonly [P in K]: InterstateInitializeParam<M[P]> | undefined;
};

export type InterstateSettersObject<M extends object, K extends keyof M = keyof M> = {
  readonly [P in K]: SetInterstate<M[P]>;
};

export type EnhancePlainInterface<T extends unknown> = readonly [() => T, SetInterstate<T>] & {
  readonly get: () => T;
  readonly set: () => SetInterstate<T>;
  readonly both: () => readonly [T, SetInterstate<T>];
};

export type EnhanceObjectInterface<S extends object> = readonly [
  () => S,
  InterstateSettersObject<S>
] & {
  readonly get: () => S;
  readonly set: () => InterstateSettersObject<S>;
  readonly both: () => readonly [S, InterstateSettersObject<S>];
};

type EnhanceUseInterstate<
  T extends unknown,
  ObjectInterface extends boolean = false
> = ObjectInterface extends true
  ? T extends object
    ? EnhanceObjectInterface<T>
    : never
  : EnhancePlainInterface<T>;

export type UseInterstate<M extends object = object> = keyof M extends never
  ? {
      <U extends undefined>(key: StateKey, initValue?: U): EnhanceUseInterstate<unknown>;

      <T extends unknown>(key: StateKey, initValue?: InterstateInitializeParam<T>): [T] extends [
        void
      ]
        ? EnhanceUseInterstate<undefined>
        : EnhanceUseInterstate<T>;

      <S extends object>(stateScheme: InterstateInitializeObject<S>): EnhanceUseInterstate<
        InterstateStateObject<S>,
        true
      >;
    }
  : {
      <K extends keyof M>(stateScheme: InterstateInitializeObject<M, K>): EnhanceUseInterstate<
        InterstateStateObject<M, K>,
        true
      >;

      <K extends keyof M, T extends M[K] = M[K]>(
        key: K,
        initValue?: InterstateInitializeParam<T>
      ): EnhanceUseInterstate<M[K]>;
    };

export interface GetUseInterstate {
  <M extends object = object>(): { Scope: FC; useInterstate: UseInterstate<M> };
}
