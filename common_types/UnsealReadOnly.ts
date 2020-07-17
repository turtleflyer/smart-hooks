export type UnsealReadOnly<R extends object> = { [P in keyof R]: R[P] };
