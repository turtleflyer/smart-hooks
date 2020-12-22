export interface TestParameterG<A extends object> {
  assets: A;
}

export type TestDescriptionG<T extends object> = (p: T) => [string, () => void];
