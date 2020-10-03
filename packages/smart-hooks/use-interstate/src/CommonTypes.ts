export type TrueObjectAssign = <T extends object, U extends object>(
  target: T,
  source: keyof U extends keyof T ? (U extends { [P in keyof U]: T[P] } ? U : never) : never
) => T;
