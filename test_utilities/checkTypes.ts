export type Reveal<T extends never> = T;

export type ToBeExact<T1, T2> = ((a: T1) => T1) extends (a: T2) => T2
  ? ((a: keyof T1) => keyof T1) extends (a: keyof T2) => keyof T2
    ? never
    : unknown
  : unknown;
