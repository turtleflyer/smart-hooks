import type { Dispatch, SetStateAction } from 'react';

export type StateKey = string | number | symbol;

export type Setter = Dispatch<SetStateAction<boolean>>;

export type InterstateParam<T extends unknown> =
  | Exclude<T, (...arg: never[]) => unknown>
  | ((prevValue: T) => T);

export type InterstateInitializeParam<T extends unknown> = T extends undefined
  ? () => undefined | void
  : Exclude<T, (...arg: never[]) => unknown | undefined | void> | (() => T);
