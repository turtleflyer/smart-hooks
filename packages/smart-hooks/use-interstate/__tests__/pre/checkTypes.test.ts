/* eslint-disable no-useless-computed-key */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { FC } from 'react';
import type { Reveal, ToBeExact } from '../../../../../test_utilities/checkTypes';
import { getUseInterstate, useInterstate } from '../../src/useInterstate';
import type { InterstateParam, SetInterstate, UseInterstate } from '../../src/useInterstate';

describe('Check types', () => {
  test('types are consistent', () => {
    const testIt = () => {
      const symbolKey = Symbol('jee');

      const u01 = 'ni';
      const u02 = () => 'ni';
      const u03 = () => () => {};
      const u04 = () => undefined;
      const u05 = () => {};
      const u06 = undefined;

      const tu01 = useInterstate('1', u01);
      const tu02 = useInterstate('1', u02);
      const tu03 = useInterstate('1', u03);
      const tu04 = useInterstate('1', u04);
      const tu05 = useInterstate('1', u05);
      const tu06 = useInterstate('1', u06);
      const tu07 = useInterstate('1');
      const tu08 = useInterstate(1, u02);
      const tu09 = useInterstate(Symbol('1'), u02);
      const tu10 = useInterstate<string>(Symbol('1'), u01);
      const tu11 = useInterstate<string>(Symbol('1'), u02);
      const tu12 = useInterstate<string | boolean>(Symbol('1'), u01);
      const tu13 = useInterstate<string | boolean>(Symbol('1'), u02);
      const tu14 = useInterstate<undefined>(Symbol('1'), u05);
      const tu15 = useInterstate<string>(Symbol('1'), u06);

      type CU01 = Reveal<ToBeExact<typeof tu01, [() => string, SetInterstate<string>]>>;
      type CU02 = Reveal<ToBeExact<typeof tu02, [() => string, SetInterstate<string>]>>;
      type CU03 = Reveal<ToBeExact<typeof tu03, [() => () => void, SetInterstate<() => void>]>>;
      type CU04 = Reveal<ToBeExact<typeof tu04, [() => undefined, SetInterstate<undefined>]>>;
      type CU05 = Reveal<ToBeExact<typeof tu05, [() => undefined, SetInterstate<undefined>]>>;
      type CU06 = Reveal<ToBeExact<typeof tu06, [() => unknown, SetInterstate<unknown>]>>;
      type CU07 = Reveal<ToBeExact<typeof tu07, [() => unknown, SetInterstate<unknown>]>>;
      type CU08 = Reveal<ToBeExact<typeof tu08, [() => string, SetInterstate<string>]>>;
      type CU09 = Reveal<ToBeExact<typeof tu09, [() => string, SetInterstate<string>]>>;
      type CU10 = Reveal<ToBeExact<typeof tu10, [() => string, SetInterstate<string>]>>;
      type CU11 = Reveal<ToBeExact<typeof tu11, [() => string, SetInterstate<string>]>>;
      type CU12 = Reveal<
        ToBeExact<typeof tu12, [() => string | boolean, SetInterstate<string | boolean>]>
      >;
      type CU13 = Reveal<
        ToBeExact<typeof tu13, [() => string | boolean, SetInterstate<string | boolean>]>
      >;
      type CU14 = Reveal<ToBeExact<typeof tu14, [() => undefined, SetInterstate<undefined>]>>;
      type CU15 = Reveal<ToBeExact<typeof tu15, [() => string, SetInterstate<string>]>>;

      // @ts-expect-error
      const tuErr01 = useInterstate('1', (c: number) => c + 1);
      // @ts-expect-error
      const tuErr02 = useInterstate<string | boolean[]>(77, () => ['a']);

      type T1 = string;
      type T2 = (a: boolean) => number;
      type T3 = number | boolean;
      type T4 = (() => string) | boolean[];

      type CSI1 = Reveal<ToBeExact<SetInterstate<T1>, (p: InterstateParam<string>) => void>>;
      type CSI2 = Reveal<
        ToBeExact<SetInterstate<T2>, (p: InterstateParam<(a: boolean) => number>) => void>
      >;
      type CSI3 = Reveal<
        ToBeExact<SetInterstate<T3>, (p: InterstateParam<number | boolean>) => void>
      >;
      type CSI4 = Reveal<
        ToBeExact<SetInterstate<T4>, (p: InterstateParam<(() => string) | boolean[]>) => void>
      >;

      type CIP1 = Reveal<ToBeExact<InterstateParam<T1>, string | ((p: string) => string)>>;
      type CIP2 = Reveal<
        ToBeExact<InterstateParam<T2>, (p: (a: boolean) => number) => (a: boolean) => number>
      >;
      type CIP3 = Reveal<
        ToBeExact<
          InterstateParam<T3>,
          number | boolean | ((p: number | boolean) => number | boolean)
        >
      >;
      type CIP4 = Reveal<
        ToBeExact<
          InterstateParam<T4>,
          boolean[] | ((p: (() => string) | boolean[]) => (() => string) | boolean[])
        >
      >;

      const m01 = { a: 1, 2: 'uy' };
      const m02 = { [symbolKey]: false };
      const m03 = { a: () => 'nis', 2: () => () => {} };
      const m04 = { a: undefined, 2: () => undefined, [symbolKey]: () => {} };

      const tm01 = useInterstate(m01);
      const tm02 = useInterstate(m02);
      const tm03 = useInterstate(m03);
      const tm04 = useInterstate(m04);
      const tm05 = useInterstate<{ [symbolKey]: number | boolean }>(m02);
      const tm06 = useInterstate<{ a: string; 2: () => void }>(m03);
      const tm07 = useInterstate<{ a: unknown; 2: undefined; [symbolKey]: undefined }>(m04);
      const tm08 = useInterstate<{
        a: string | boolean;
        2: (() => string) | undefined;
        [symbolKey]: number | undefined;
      }>(m04);

      type CM01 = Reveal<
        ToBeExact<
          typeof tm01,
          [() => { a: number; 2: string }, { a: SetInterstate<number>; 2: SetInterstate<string> }]
        >
      >;
      type CM02 = Reveal<
        ToBeExact<
          typeof tm02,
          [() => { [symbolKey]: boolean }, { [symbolKey]: SetInterstate<boolean> }]
        >
      >;
      type CM03 = Reveal<
        ToBeExact<
          typeof tm03,
          [
            () => { a: string; 2: () => void },
            { a: SetInterstate<string>; 2: SetInterstate<() => void> }
          ]
        >
      >;

      // TODO: Make the scheme to work
      //
      // type CM04 = Reveal<
      //   toBeExact<
      //     typeof tm04,
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

      type CM05 = Reveal<
        ToBeExact<
          typeof tm05,
          [
            () => { [symbolKey]: number | boolean },
            { [symbolKey]: SetInterstate<number | boolean> }
          ]
        >
      >;
      type CM06 = Reveal<
        ToBeExact<
          typeof tm06,
          [
            () => { a: string; 2: () => void },
            { a: SetInterstate<string>; 2: SetInterstate<() => void> }
          ]
        >
      >;
      type CM07 = Reveal<
        ToBeExact<
          typeof tm07,
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
      type CM08 = Reveal<
        ToBeExact<
          typeof tm08,
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

      // @ts-expect-error
      const tmErr01 = useInterstate({ a: (p: string) => 1 });

      interface State {
        a: string;
        2: (boolean | number)[];
        [symbolKey]: (() => unknown) | { b: number | object };
        77: undefined;
        fun: unknown;
        go: null | undefined | string[];
      }
      const g = getUseInterstate<State>();
      type G = Reveal<ToBeExact<typeof g, { Scope: FC; useInterstate: UseInterstate<State> }>>;
      const { useInterstate: useInterstateDefined } = g;

      const d01 = 'la';
      const d02 = () => [true];
      const d03 = { b: 1 };
      const d04 = () => undefined;
      const d05 = () => {};

      const td01 = useInterstateDefined('a', d01);
      const td02 = useInterstateDefined(2, d02);
      const td03 = useInterstateDefined(symbolKey, d03);
      const td04 = useInterstateDefined(77, d04);
      const td05 = useInterstateDefined(77, d05);
      const td06 = useInterstateDefined('fun', undefined);
      const td07 = useInterstateDefined('go', d04);
      const td08 = useInterstateDefined('go', undefined);
      const td09 = useInterstateDefined(2, undefined);
      const td10 = useInterstateDefined<2 | 'a'>('a', d01);

      type CD01 = Reveal<ToBeExact<typeof td01, [() => string, SetInterstate<string>]>>;
      type CD02 = Reveal<
        ToBeExact<typeof td02, [() => (boolean | number)[], SetInterstate<(boolean | number)[]>]>
      >;
      type CD03 = Reveal<
        ToBeExact<
          typeof td03,
          [
            () => (() => unknown) | { b: number | object },
            SetInterstate<(() => unknown) | { b: number | object }>
          ]
        >
      >;
      type CD04 = Reveal<ToBeExact<typeof td04, [() => undefined, SetInterstate<undefined>]>>;
      type CD05 = Reveal<ToBeExact<typeof td05, [() => undefined, SetInterstate<undefined>]>>;
      type CD06 = Reveal<ToBeExact<typeof td06, [() => unknown, SetInterstate<unknown>]>>;
      type CD07 = Reveal<
        ToBeExact<
          typeof td07,
          [() => null | undefined | string[], SetInterstate<null | undefined | string[]>]
        >
      >;
      type CD08 = Reveal<
        ToBeExact<
          typeof td08,
          [() => null | undefined | string[], SetInterstate<null | undefined | string[]>]
        >
      >;
      type CD09 = Reveal<
        ToBeExact<typeof td09, [() => (boolean | number)[], SetInterstate<(boolean | number)[]>]>
      >;
      type CD10 = Reveal<
        ToBeExact<
          typeof td10,
          [() => string | (boolean | number)[], SetInterstate<string | (boolean | number)[]>]
        >
      >;

      // @ts-expect-error
      const tdErr01 = useInterstateDefined('1', () => 1);
      // @ts-expect-error
      const tdErr02 = useInterstateDefined<string | boolean[]>(77, () => ['a']);
      // @ts-expect-error
      const tdErr03 = useInterstateDefined(symbolKey, d02);
      // @ts-expect-error
      const tdErr04 = useInterstateDefined<string>('a', d01);
      // @ts-expect-error
      const tdErr05 = useInterstateDefined(1, undefined);
      // @ts-expect-error
      const tdErr06 = useInterstateDefined(1);
      // @ts-expect-error
      const tdErr07 = useInterstateDefined('go', (y: boolean) => ['no']);

      const s01 = { a: () => 'hurray' };
      const s02 = {
        a: 'tree',
        [77]: () => undefined,
        [symbolKey]: { b: { bb: 6 } },
        fun: () => () => {},
      };
      const s03 = { [symbolKey]: () => () => 'eh' };
      const s04 = {
        a: undefined,
        [2]: undefined,
        [symbolKey]: undefined,
        [77]: undefined,
        fun: undefined,
        go: undefined,
      };

      const ts01 = useInterstateDefined(s01);
      const ts02 = useInterstateDefined(s02);
      const ts03 = useInterstateDefined(s03);
      const ts04 = useInterstateDefined(s04);

      type CS01 = Reveal<
        ToBeExact<typeof ts01, [() => { a: string }, { a: SetInterstate<string> }]>
      >;
      type CS02 = Reveal<
        ToBeExact<
          typeof ts02,
          [
            () => {
              a: string;
              77: undefined;
              [symbolKey]: (() => unknown) | { b: number | object };
              fun: unknown;
            },
            {
              a: SetInterstate<string>;
              77: SetInterstate<undefined>;
              [symbolKey]: SetInterstate<(() => unknown) | { b: number | object }>;
              fun: SetInterstate<unknown>;
            }
          ]
        >
      >;
      type CS03 = Reveal<
        ToBeExact<
          typeof ts03,
          [
            () => { [symbolKey]: (() => unknown) | { b: number | object } },
            { [symbolKey]: SetInterstate<(() => unknown) | { b: number | object }> }
          ]
        >
      >;
      type CS04 = Reveal<
        ToBeExact<
          typeof ts04,
          [
            () => {
              a: string;
              2: (boolean | number)[];
              [symbolKey]: (() => unknown) | { b: number | object };
              77: undefined;
              fun: unknown;
              go: null | undefined | string[];
            },
            {
              a: SetInterstate<string>;
              2: SetInterstate<(boolean | number)[]>;
              [symbolKey]: SetInterstate<(() => unknown) | { b: number | object }>;
              77: SetInterstate<undefined>;
              fun: SetInterstate<unknown>;
              go: SetInterstate<null | undefined | string[]>;
            }
          ]
        >
      >;

      // @ts-expect-error
      const tsErr01 = useInterstateDefined({ a: () => 1, [symbolKey]: { b: { bb: 6 } } });
      // @ts-expect-error
      const tsErr02 = useInterstateDefined({ [symbolKey]: () => 'eh' });
      // @ts-expect-error
      const tsErr03 = useInterstateDefined({ [symbolKey]: () => () => 'eh', b: null });
      // @ts-expect-error
      const tsErr04 = useInterstateDefined({ a: 'bo', er: 2 });
    };
  });
});
