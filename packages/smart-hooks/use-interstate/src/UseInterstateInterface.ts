import type { Dispatch, FC, SetStateAction } from 'react';

export type StateKey = string | number | symbol;

export type Setter = Dispatch<SetStateAction<boolean>>;

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

export type UseInterstate<M extends object = object> = keyof M extends never
  ? {
      <U extends undefined>(key: StateKey, initValue?: U): [() => unknown, SetInterstate<unknown>];

      <T extends unknown>(key: StateKey, initValue?: InterstateInitializeParam<T>): [T] extends [
        void
      ]
        ? [() => undefined, SetInterstate<undefined>]
        : [() => T, SetInterstate<T>];

      <S extends object>(stateScheme: InterstateInitializeObject<S>): [
        () => InterstateStateObject<S>,
        InterstateSettersObject<S>
      ];
    }
  : {
      <K extends keyof M>(stateScheme: InterstateInitializeObject<M, K>): [
        () => InterstateStateObject<M, K>,
        InterstateSettersObject<M, K>
      ];

      <K extends keyof M, T extends M[K] = M[K]>(
        key: K,
        initValue?: InterstateInitializeParam<T>
      ): [() => M[K], SetInterstate<M[K]>];
    };

export interface GetUseInterstate {
  <M extends object = object>(): { Scope: FC; useInterstate: UseInterstate<M> };
}
