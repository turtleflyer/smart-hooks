export type Reveal<T extends never> = T;

export type ToBeExact<T1, T2> = ((a: T1, b: keyof T1) => [T1, keyof T1]) extends (
  a: T2,
  b: keyof T2
) => [T2, keyof T2]
  ? never
  : unknown;
