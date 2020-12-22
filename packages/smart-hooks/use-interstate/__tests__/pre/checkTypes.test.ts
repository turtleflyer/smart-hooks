/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-useless-computed-key */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import type { Reveal, ToBeExact } from '@~internal/check-types';
import { FC } from 'react';
import type {
  GetUseInterstate,
  InterstateInitializeObject,
  InterstateInitializeParam,
  InterstateParam,
  InterstateSettersObject,
  InterstateStateObject,
  SetInterstate,
  StateKey,
  UseInterstate,
  UseInterstateError,
  UseInterstateErrorMethods,
} from '../../src/useInterstate';
import {
  getUseInterstate,
  getUseInterstateErrorsHandleMethods,
  isUseInterstateError,
  useInterstate,
} from '../../src/useInterstate';

describe('Check types', () => {
  test('types are consistent', () => {
    const testIt = () => {
      type C01 = Reveal<ToBeExact<typeof getUseInterstate, GetUseInterstate>>;
      type C02 = Reveal<ToBeExact<StateKey, number | string | symbol>>;

      const symbolKey = Symbol('jee');

      let u01 = 'ni';
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

      type CU01 = Reveal<
        ToBeExact<
          typeof tu01,
          readonly [() => string, SetInterstate<string>] & {
            get: () => string;
            set: () => SetInterstate<string>;
            both: () => readonly [string, SetInterstate<string>];
          }
        >
      >;
      type CU02 = Reveal<
        ToBeExact<
          typeof tu02,
          readonly [() => string, SetInterstate<string>] & {
            get: () => string;
            set: () => SetInterstate<string>;
            both: () => readonly [string, SetInterstate<string>];
          }
        >
      >;
      type CU03 = Reveal<
        ToBeExact<
          typeof tu03,
          readonly [() => () => void, SetInterstate<() => void>] & {
            get: () => () => void;
            set: () => SetInterstate<() => void>;
            both: () => readonly [() => void, SetInterstate<() => void>];
          }
        >
      >;
      type CU04 = Reveal<
        ToBeExact<
          typeof tu04,
          readonly [() => undefined, SetInterstate<undefined>] & {
            get: () => undefined;
            set: () => SetInterstate<undefined>;
            both: () => readonly [undefined, SetInterstate<undefined>];
          }
        >
      >;
      type CU05 = Reveal<
        ToBeExact<
          typeof tu05,
          readonly [() => undefined, SetInterstate<undefined>] & {
            get: () => undefined;
            set: () => SetInterstate<undefined>;
            both: () => readonly [undefined, SetInterstate<undefined>];
          }
        >
      >;
      type CU06 = Reveal<
        ToBeExact<
          typeof tu06,
          readonly [() => unknown, SetInterstate<unknown>] & {
            get: () => unknown;
            set: () => SetInterstate<unknown>;
            both: () => readonly [unknown, SetInterstate<unknown>];
          }
        >
      >;
      type CU07 = Reveal<
        ToBeExact<
          typeof tu07,
          readonly [() => unknown, SetInterstate<unknown>] & {
            get: () => unknown;
            set: () => SetInterstate<unknown>;
            both: () => readonly [unknown, SetInterstate<unknown>];
          }
        >
      >;
      type CU08 = Reveal<
        ToBeExact<
          typeof tu08,
          readonly [() => string, SetInterstate<string>] & {
            get: () => string;
            set: () => SetInterstate<string>;
            both: () => readonly [string, SetInterstate<string>];
          }
        >
      >;
      type CU09 = Reveal<
        ToBeExact<
          typeof tu09,
          readonly [() => string, SetInterstate<string>] & {
            get: () => string;
            set: () => SetInterstate<string>;
            both: () => readonly [string, SetInterstate<string>];
          }
        >
      >;
      type CU10 = Reveal<
        ToBeExact<
          typeof tu10,
          readonly [() => string, SetInterstate<string>] & {
            get: () => string;
            set: () => SetInterstate<string>;
            both: () => readonly [string, SetInterstate<string>];
          }
        >
      >;
      type CU11 = Reveal<
        ToBeExact<
          typeof tu11,
          readonly [() => string, SetInterstate<string>] & {
            get: () => string;
            set: () => SetInterstate<string>;
            both: () => readonly [string, SetInterstate<string>];
          }
        >
      >;
      type CU12 = Reveal<
        ToBeExact<
          typeof tu12,
          readonly [() => string | boolean, SetInterstate<string | boolean>] & {
            get: () => string | boolean;
            set: () => SetInterstate<string | boolean>;
            both: () => readonly [string | boolean, SetInterstate<string | boolean>];
          }
        >
      >;
      type CU13 = Reveal<
        ToBeExact<
          typeof tu13,
          readonly [() => string | boolean, SetInterstate<string | boolean>] & {
            get: () => string | boolean;
            set: () => SetInterstate<string | boolean>;
            both: () => readonly [string | boolean, SetInterstate<string | boolean>];
          }
        >
      >;
      type CU14 = Reveal<
        ToBeExact<
          typeof tu14,
          readonly [() => undefined, SetInterstate<undefined>] & {
            get: () => undefined;
            set: () => SetInterstate<undefined>;
            both: () => readonly [undefined, SetInterstate<undefined>];
          }
        >
      >;
      type CU15 = Reveal<
        ToBeExact<
          typeof tu15,
          readonly [() => string, SetInterstate<string>] & {
            get: () => string;
            set: () => SetInterstate<string>;
            both: () => readonly [string, SetInterstate<string>];
          }
        >
      >;

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
          readonly [
            () => { a: number; 2: string },
            { a: SetInterstate<number>; 2: SetInterstate<string> }
          ] & {
            get: () => { a: number; 2: string };
            set: () => { a: SetInterstate<number>; 2: SetInterstate<string> };
            both: () => readonly [
              { a: number; 2: string },
              { a: SetInterstate<number>; 2: SetInterstate<string> }
            ];
          }
        >
      >;
      type CM02 = Reveal<
        ToBeExact<
          typeof tm02,
          readonly [() => { [symbolKey]: boolean }, { [symbolKey]: SetInterstate<boolean> }] & {
            get: () => { [symbolKey]: boolean };
            set: () => { [symbolKey]: SetInterstate<boolean> };
            both: () => readonly [
              { [symbolKey]: boolean },
              { [symbolKey]: SetInterstate<boolean> }
            ];
          }
        >
      >;
      type CM03 = Reveal<
        ToBeExact<
          typeof tm03,
          readonly [
            () => { a: string; 2: () => void },
            { a: SetInterstate<string>; 2: SetInterstate<() => void> }
          ] & {
            get: () => { a: string; 2: () => void };
            set: () => { a: SetInterstate<string>; 2: SetInterstate<() => void> };
            both: () => readonly [
              { a: string; 2: () => void },
              { a: SetInterstate<string>; 2: SetInterstate<() => void> }
            ];
          }
        >
      >;

      type CM05 = Reveal<
        ToBeExact<
          typeof tm05,
          readonly [
            () => { [symbolKey]: number | boolean },
            { [symbolKey]: SetInterstate<number | boolean> }
          ] & {
            get: () => { [symbolKey]: number | boolean };
            set: () => { [symbolKey]: SetInterstate<number | boolean> };
            both: () => readonly [
              { [symbolKey]: number | boolean },
              { [symbolKey]: SetInterstate<number | boolean> }
            ];
          }
        >
      >;
      type CM06 = Reveal<
        ToBeExact<
          typeof tm06,
          readonly [
            () => { a: string; 2: () => void },
            { a: SetInterstate<string>; 2: SetInterstate<() => void> }
          ] & {
            get: () => { a: string; 2: () => void };
            set: () => { a: SetInterstate<string>; 2: SetInterstate<() => void> };
            both: () => readonly [
              { a: string; 2: () => void },
              { a: SetInterstate<string>; 2: SetInterstate<() => void> }
            ];
          }
        >
      >;
      type CM07 = Reveal<
        ToBeExact<
          typeof tm07,
          readonly [
            () => { a: unknown; 2: undefined; [symbolKey]: undefined },
            {
              a: SetInterstate<unknown>;
              2: SetInterstate<undefined>;
              [symbolKey]: SetInterstate<undefined>;
            }
          ] & {
            get: () => { a: unknown; 2: undefined; [symbolKey]: undefined };
            set: () => {
              a: SetInterstate<unknown>;
              2: SetInterstate<undefined>;
              [symbolKey]: SetInterstate<undefined>;
            };
            both: () => readonly [
              { a: unknown; 2: undefined; [symbolKey]: undefined },
              {
                a: SetInterstate<unknown>;
                2: SetInterstate<undefined>;
                [symbolKey]: SetInterstate<undefined>;
              }
            ];
          }
        >
      >;
      type CM08 = Reveal<
        ToBeExact<
          typeof tm08,
          readonly [
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
          ] & {
            get: () => {
              a: string | boolean;
              2: (() => string) | undefined;
              [symbolKey]: number | undefined;
            };
            set: () => {
              a: SetInterstate<string | boolean>;
              2: SetInterstate<(() => string) | undefined>;
              [symbolKey]: SetInterstate<number | undefined>;
            };
            both: () => readonly [
              {
                a: string | boolean;
                2: (() => string) | undefined;
                [symbolKey]: number | undefined;
              },
              {
                a: SetInterstate<string | boolean>;
                2: SetInterstate<(() => string) | undefined>;
                [symbolKey]: SetInterstate<number | undefined>;
              }
            ];
          }
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

      type CD01 = Reveal<
        ToBeExact<
          typeof td01,
          readonly [() => string, SetInterstate<string>] & {
            get: () => string;
            set: () => SetInterstate<string>;
            both: () => readonly [string, SetInterstate<string>];
          }
        >
      >;
      type CD02 = Reveal<
        ToBeExact<
          typeof td02,
          readonly [() => (boolean | number)[], SetInterstate<(boolean | number)[]>] & {
            get: () => (boolean | number)[];
            set: () => SetInterstate<(boolean | number)[]>;
            both: () => readonly [(boolean | number)[], SetInterstate<(boolean | number)[]>];
          }
        >
      >;
      type CD03 = Reveal<
        ToBeExact<
          typeof td03,
          readonly [
            () => (() => unknown) | { b: number | object },
            SetInterstate<(() => unknown) | { b: number | object }>
          ] & {
            get: () => (() => unknown) | { b: number | object };
            set: () => SetInterstate<(() => unknown) | { b: number | object }>;
            both: () => readonly [
              (() => unknown) | { b: number | object },
              SetInterstate<(() => unknown) | { b: number | object }>
            ];
          }
        >
      >;
      type CD04 = Reveal<
        ToBeExact<
          typeof td04,
          readonly [() => undefined, SetInterstate<undefined>] & {
            get: () => undefined;
            set: () => SetInterstate<undefined>;
            both: () => readonly [undefined, SetInterstate<undefined>];
          }
        >
      >;
      type CD05 = Reveal<
        ToBeExact<
          typeof td05,
          readonly [() => undefined, SetInterstate<undefined>] & {
            get: () => undefined;
            set: () => SetInterstate<undefined>;
            both: () => readonly [undefined, SetInterstate<undefined>];
          }
        >
      >;
      type CD06 = Reveal<
        ToBeExact<
          typeof td06,
          readonly [() => unknown, SetInterstate<unknown>] & {
            get: () => unknown;
            set: () => SetInterstate<unknown>;
            both: () => readonly [unknown, SetInterstate<unknown>];
          }
        >
      >;
      type CD07 = Reveal<
        ToBeExact<
          typeof td07,
          readonly [
            () => null | undefined | string[],
            SetInterstate<null | undefined | string[]>
          ] & {
            get: () => null | undefined | string[];
            set: () => SetInterstate<null | undefined | string[]>;
            both: () => readonly [
              null | undefined | string[],
              SetInterstate<null | undefined | string[]>
            ];
          }
        >
      >;
      type CD08 = Reveal<
        ToBeExact<
          typeof td08,
          readonly [
            () => null | undefined | string[],
            SetInterstate<null | undefined | string[]>
          ] & {
            get: () => null | undefined | string[];
            set: () => SetInterstate<null | undefined | string[]>;
            both: () => readonly [
              null | undefined | string[],
              SetInterstate<null | undefined | string[]>
            ];
          }
        >
      >;
      type CD09 = Reveal<
        ToBeExact<
          typeof td09,
          readonly [() => (boolean | number)[], SetInterstate<(boolean | number)[]>] & {
            get: () => (boolean | number)[];
            set: () => SetInterstate<(boolean | number)[]>;
            both: () => readonly [(boolean | number)[], SetInterstate<(boolean | number)[]>];
          }
        >
      >;
      type CD10 = Reveal<
        ToBeExact<
          typeof td10,
          readonly [
            () => string | (boolean | number)[],
            SetInterstate<string | (boolean | number)[]>
          ] & {
            get: () => string | (boolean | number)[];
            set: () => SetInterstate<string | (boolean | number)[]>;
            both: () => readonly [
              string | (boolean | number)[],
              SetInterstate<string | (boolean | number)[]>
            ];
          }
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
        ToBeExact<
          typeof ts01,
          readonly [() => { a: string }, { a: SetInterstate<string> }] & {
            get: () => { a: string };
            set: () => { a: SetInterstate<string> };
            both: () => readonly [{ a: string }, { a: SetInterstate<string> }];
          }
        >
      >;
      type CS02 = Reveal<
        ToBeExact<
          typeof ts02,
          readonly [
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
          ] & {
            get: () => {
              a: string;
              77: undefined;
              [symbolKey]: (() => unknown) | { b: number | object };
              fun: unknown;
            };
            set: () => {
              a: SetInterstate<string>;
              77: SetInterstate<undefined>;
              [symbolKey]: SetInterstate<(() => unknown) | { b: number | object }>;
              fun: SetInterstate<unknown>;
            };
            both: () => readonly [
              {
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
            ];
          }
        >
      >;
      type CS03 = Reveal<
        ToBeExact<
          typeof ts03,
          readonly [
            () => { [symbolKey]: (() => unknown) | { b: number | object } },
            { [symbolKey]: SetInterstate<(() => unknown) | { b: number | object }> }
          ] & {
            get: () => { [symbolKey]: (() => unknown) | { b: number | object } };
            set: () => { [symbolKey]: SetInterstate<(() => unknown) | { b: number | object }> };
            both: () => readonly [
              { [symbolKey]: (() => unknown) | { b: number | object } },
              { [symbolKey]: SetInterstate<(() => unknown) | { b: number | object }> }
            ];
          }
        >
      >;
      type CS04 = Reveal<
        ToBeExact<
          typeof ts04,
          readonly [
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
          ] & {
            get: () => {
              a: string;
              2: (boolean | number)[];
              [symbolKey]: (() => unknown) | { b: number | object };
              77: undefined;
              fun: unknown;
              go: null | undefined | string[];
            };
            set: () => {
              a: SetInterstate<string>;
              2: SetInterstate<(boolean | number)[]>;
              [symbolKey]: SetInterstate<(() => unknown) | { b: number | object }>;
              77: SetInterstate<undefined>;
              fun: SetInterstate<unknown>;
              go: SetInterstate<null | undefined | string[]>;
            };
            both: () => readonly [
              {
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
            ];
          }
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

      const e01 = new Error() as UseInterstateError;
      const e02 = new Error();

      const te01 = getUseInterstateErrorsHandleMethods(e01);
      const te02 = getUseInterstateErrorsHandleMethods(e02);

      type CE01 = Reveal<ToBeExact<typeof te01, UseInterstateErrorMethods>>;
      type CE02 = Reveal<ToBeExact<typeof te02, undefined>>;

      const tee01 = isUseInterstateError(e01);
      const tee02 = isUseInterstateError(e02);

      type CEE01 = Reveal<ToBeExact<typeof tee01, boolean>>;
      type CEE02 = Reveal<ToBeExact<typeof tee02, boolean>>;

      type CUIP01 = Reveal<ToBeExact<InterstateInitializeParam<string>, string | (() => string)>>;
      type CUIP02 = Reveal<
        ToBeExact<
          InterstateInitializeParam<string | undefined>,
          string | ((() => string) | (() => undefined | void))
        >
      >;
      type CUIP03 = Reveal<
        ToBeExact<
          InterstateInitializeParam<string | boolean>,
          string | boolean | (() => string) | (() => true) | (() => false)
        >
      >;
      type CUIP04 = Reveal<
        ToBeExact<InterstateInitializeParam<() => number | boolean>, () => () => number | boolean>
      >;
      type CUIP05 = Reveal<
        ToBeExact<
          InterstateInitializeParam<number | (() => { foo: string })>,
          number | (() => number) | (() => () => { foo: string })
        >
      >;

      type CUP01 = Reveal<ToBeExact<InterstateParam<string>, string | ((a: string) => string)>>;
      type CUP02 = Reveal<
        ToBeExact<
          InterstateParam<string | undefined>,
          string | undefined | ((a: string | undefined) => string | undefined)
        >
      >;
      type CUP03 = Reveal<
        ToBeExact<
          InterstateParam<string | boolean>,
          string | boolean | ((a: string | boolean) => string | boolean)
        >
      >;
      type CUP04 = Reveal<
        ToBeExact<
          InterstateParam<() => number | boolean>,
          (a: () => number | boolean) => () => number | boolean
        >
      >;
      type CUP05 = Reveal<
        ToBeExact<
          InterstateParam<number | (() => { foo: string })>,
          number | ((a: number | (() => { foo: string })) => number | (() => { foo: string }))
        >
      >;

      type OS01 = Reveal<
        ToBeExact<
          InterstateStateObject<{ one: string; [symbolKey]: number | undefined | null }>,
          { readonly one: string; readonly [symbolKey]: number | undefined | null }
        >
      >;
      type OS02 = Reveal<
        ToBeExact<
          InterstateStateObject<
            { one: string; [symbolKey]: number | undefined | null },
            typeof symbolKey
          >,
          { readonly [symbolKey]: number | undefined | null }
        >
      >;
      type OSErr03 = InterstateStateObject<
        { one: string; [symbolKey]: number | undefined | null },
        // @ts-expect-error
        typeof symbolKey | 'two'
      >;

      type OI01 = Reveal<
        ToBeExact<
          InterstateInitializeObject<{ one: string; [symbolKey]: number | undefined | null }>,
          {
            readonly one: string | (() => string) | undefined;
            readonly [symbolKey]:
              | number
              | null
              | (() => number)
              | (() => undefined | void)
              | (() => null)
              | undefined;
          }
        >
      >;
      type OI02 = Reveal<
        ToBeExact<
          InterstateInitializeObject<
            { one: string; [symbolKey]: number | undefined | null },
            typeof symbolKey
          >,
          {
            readonly [symbolKey]:
              | number
              | null
              | (() => number)
              | (() => undefined | void)
              | (() => null)
              | undefined;
          }
        >
      >;
      type OI0Err3 = InterstateInitializeObject<
        { one: string; [symbolKey]: number | undefined | null },
        // @ts-expect-error
        typeof symbolKey | 'two'
      >;

      type OSE01 = Reveal<
        ToBeExact<
          InterstateSettersObject<{ one: string; [symbolKey]: number | undefined | null }>,
          {
            readonly one: SetInterstate<string>;
            readonly [symbolKey]: (
              a:
                | number
                | undefined
                | null
                | ((p: number | undefined | null) => number | undefined | null)
            ) => void;
          }
        >
      >;
      type OSE02 = Reveal<
        ToBeExact<
          InterstateSettersObject<
            { one: string; [symbolKey]: number | undefined | null },
            typeof symbolKey
          >,
          {
            readonly [symbolKey]: (
              a:
                | number
                | undefined
                | null
                | ((p: number | undefined | null) => number | undefined | null)
            ) => void;
          }
        >
      >;
      type OSEErr03 = InterstateSettersObject<
        { one: string; [symbolKey]: number | undefined | null },
        // @ts-expect-error
        typeof symbolKey | 'two'
      >;
    };
  });
});
