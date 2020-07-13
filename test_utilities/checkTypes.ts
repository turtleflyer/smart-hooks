export type FinalCheck<T extends never> = T;

export type FirstStageCheck<T1, T2 extends T1> = T1 extends T2 ? never : true;
