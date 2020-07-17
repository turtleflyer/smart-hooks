export type StateKey = string | number | symbol;

export type Setter = React.Dispatch<React.SetStateAction<boolean>>;

export type InterstateParam<T> = Exclude<T, (...arg: any[]) => any> | ((prevValue: T) => T);

export type InterstateInitializeParam<T> = T extends undefined
  ? () => undefined | void
  : Exclude<T, (...arg: any[]) => any | undefined | void> | (() => T);
