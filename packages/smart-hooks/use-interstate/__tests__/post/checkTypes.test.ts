import type { FinalCheck, FirstStageCheck } from '../../../../../test_utilities/checkTypes';
import { useInterstate } from '../../lib/use-interstate';
import type { InterstateParam, SetInterstate } from '../../lib/use-interstate';

describe('Check types', () => {
  test('types are consistent', () => {
    const u01 = 'ni';
    const u02 = () => 'ni';
    const u03 = () => () => {};
    const u04 = () => undefined;
    const u05 = () => {};
    const u06 = undefined;

    const tu01 = () => useInterstate('1', u01);
    const tu02 = () => useInterstate('1', u02);
    const tu03 = () => useInterstate('1', u03);
    const tu04 = () => useInterstate('1', u04);
    const tu05 = () => useInterstate('1', u05);
    const tu06 = () => useInterstate('1', u06);
    const tu07 = () => useInterstate('1');
    const tu08 = () => useInterstate(1, u02);
    const tu09 = () => useInterstate(Symbol('1'), u02);
    const tu10 = () => useInterstate<string>(Symbol('1'), u01);
    const tu11 = () => useInterstate<string>(Symbol('1'), u02);
    const tu12 = () => useInterstate<string | boolean>(Symbol('1'), u01);
    const tu13 = () => useInterstate<string | boolean>(Symbol('1'), u02);
    const tu14 = () => useInterstate<undefined>(Symbol('1'), u05);
    const tu15 = () => useInterstate<string>(Symbol('1'), u06);

    // It should get an error:
    // const _tu = () => useInterstate('1', (c: number) => c + 1);

    type CU01 = FinalCheck<
      FirstStageCheck<ReturnType<typeof tu01>, [() => string, SetInterstate<string>]>
    >;
    type CU02 = FinalCheck<
      FirstStageCheck<ReturnType<typeof tu02>, [() => string, SetInterstate<string>]>
    >;
    type CU03 = FinalCheck<
      FirstStageCheck<ReturnType<typeof tu03>, [() => () => void, SetInterstate<() => void>]>
    >;
    type CU04 = FinalCheck<
      FirstStageCheck<ReturnType<typeof tu04>, [() => undefined, SetInterstate<undefined>]>
    >;
    type CU05 = FinalCheck<
      FirstStageCheck<ReturnType<typeof tu05>, [() => undefined, SetInterstate<undefined>]>
    >;
    type CU06 = FinalCheck<
      FirstStageCheck<ReturnType<typeof tu06>, [() => unknown, SetInterstate<unknown>]>
    >;
    type CU07 = FinalCheck<
      FirstStageCheck<ReturnType<typeof tu07>, [() => unknown, SetInterstate<unknown>]>
    >;
    type CU08 = FinalCheck<
      FirstStageCheck<ReturnType<typeof tu08>, [() => string, SetInterstate<string>]>
    >;
    type CU09 = FinalCheck<
      FirstStageCheck<ReturnType<typeof tu09>, [() => string, SetInterstate<string>]>
    >;
    type CU10 = FinalCheck<
      FirstStageCheck<ReturnType<typeof tu10>, [() => string, SetInterstate<string>]>
    >;
    type CU11 = FinalCheck<
      FirstStageCheck<ReturnType<typeof tu11>, [() => string, SetInterstate<string>]>
    >;
    type CU12 = FinalCheck<
      FirstStageCheck<
        ReturnType<typeof tu12>,
        [() => string | boolean, SetInterstate<string | boolean>]
      >
    >;
    type CU13 = FinalCheck<
      FirstStageCheck<
        ReturnType<typeof tu13>,
        [() => string | boolean, SetInterstate<string | boolean>]
      >
    >;
    type CU14 = FinalCheck<
      FirstStageCheck<ReturnType<typeof tu14>, [() => undefined, SetInterstate<undefined>]>
    >;
    type CU15 = FinalCheck<
      FirstStageCheck<ReturnType<typeof tu15>, [() => string, SetInterstate<string>]>
    >;

    type T1 = string;
    type T2 = (a: boolean) => number;
    type T3 = number | boolean;
    type T4 = (() => string) | boolean[];

    type CS1 = FinalCheck<FirstStageCheck<SetInterstate<T1>, (p: InterstateParam<string>) => void>>;
    type CS2 = FinalCheck<
      FirstStageCheck<SetInterstate<T2>, (p: InterstateParam<(a: boolean) => number>) => void>
    >;
    type CS3 = FinalCheck<
      FirstStageCheck<SetInterstate<T3>, (p: InterstateParam<number | boolean>) => void>
    >;
    type CS4 = FinalCheck<
      FirstStageCheck<SetInterstate<T4>, (p: InterstateParam<(() => string) | boolean[]>) => void>
    >;

    type CI1 = FinalCheck<FirstStageCheck<InterstateParam<T1>, string | ((p: string) => string)>>;
    type CI2 = FinalCheck<
      FirstStageCheck<InterstateParam<T2>, (p: (a: boolean) => number) => (a: boolean) => number>
    >;
    type CI3 = FinalCheck<
      FirstStageCheck<
        InterstateParam<T3>,
        number | boolean | ((p: number | boolean) => number | boolean)
      >
    >;
    type CI4 = FinalCheck<
      FirstStageCheck<
        InterstateParam<T4>,
        boolean[] | ((p: (() => string) | boolean[]) => (() => string) | boolean[])
      >
    >;

    const symbolKey = Symbol('jee');
    const m01 = { a: 1, 2: 'uy' };
    const m02 = { [symbolKey]: false };
    const m03 = { a: () => 'nis', 2: () => () => {} };
    const m04 = { a: undefined, 2: () => undefined, [symbolKey]: () => {} };

    const tm01 = () => useInterstate(m01);
    const tm02 = () => useInterstate(m02);
    const tm03 = () => useInterstate(m03);
    const tm04 = () => useInterstate(m04);
    const tm05 = () => useInterstate<{ [symbolKey]: number | boolean }>(m02);
    const tm06 = () => useInterstate<{ a: string; 2: () => void }>(m03);
    const tm07 = () => useInterstate<{ a: unknown; 2: undefined; [symbolKey]: undefined }>(m04);
    const tm08 = () =>
      useInterstate<{
        a: string | boolean;
        2: (() => string) | undefined;
        [symbolKey]: number | undefined;
      }>(m04);

    // It should get an error:
    // const _tm = () => useInterstate({ a: (p: string) => 1 });

    type CM01 = FinalCheck<
      FirstStageCheck<
        ReturnType<typeof tm01>,
        [() => { a: number; 2: string }, { a: SetInterstate<number>; 2: SetInterstate<string> }]
      >
    >;
    type CM02 = FinalCheck<
      FirstStageCheck<
        ReturnType<typeof tm02>,
        [() => { [symbolKey]: boolean }, { [symbolKey]: SetInterstate<boolean> }]
      >
    >;
    type CM03 = FinalCheck<
      FirstStageCheck<
        ReturnType<typeof tm03>,
        [
          () => { a: string; 2: () => void },
          { a: SetInterstate<string>; 2: SetInterstate<() => void> }
        ]
      >
    >;
    // TODO: Make the scheme to work
    //
    // type CM04 = FinalCheck<
    //   FirstStageCheck<
    //     ReturnType<typeof tm04>,
    //     [
    //       () => { a: unknown; 2: undefined; [symbolKey]: undefined },
    //       {
    //         a: SetInterstate<unknown>;
    //         2: SetInterstate<undefined>;
    //         [symbolKey]: SetInterstate<undefined>;
    //       }
    //     ]
    //   >
    // >;
    type CM05 = FinalCheck<
      FirstStageCheck<
        ReturnType<typeof tm05>,
        [() => { [symbolKey]: number | boolean }, { [symbolKey]: SetInterstate<number | boolean> }]
      >
    >;
    type CM06 = FinalCheck<
      FirstStageCheck<
        ReturnType<typeof tm06>,
        [
          () => { a: string; 2: () => void },
          { a: SetInterstate<string>; 2: SetInterstate<() => void> }
        ]
      >
    >;
    type CM07 = FinalCheck<
      FirstStageCheck<
        ReturnType<typeof tm07>,
        [
          () => { a: unknown; 2: undefined; [symbolKey]: undefined },
          {
            a: SetInterstate<unknown>;
            2: SetInterstate<undefined>;
            [symbolKey]: SetInterstate<undefined>;
          }
        ]
      >
    >;
    type CM08 = FinalCheck<
      FirstStageCheck<
        ReturnType<typeof tm08>,
        [
          () => {
            a: string | boolean;
            2: (() => string) | undefined;
            [symbolKey]: number | undefined;
          },
          {
            a: SetInterstate<string | boolean>;
            2: SetInterstate<(() => string) | undefined>;
            [symbolKey]: SetInterstate<number | undefined>;
          }
        ]
      >
    >;
  });
});
