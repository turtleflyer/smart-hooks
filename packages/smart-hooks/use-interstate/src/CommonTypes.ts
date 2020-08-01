export declare function fixControlFlowAnalysis(): never;

export type TrueObjectAssign = <T extends object, U extends Partial<T>>(
  target: T,
  source: U
) => T & U;
