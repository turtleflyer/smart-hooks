/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable symbol-description */
import type { Reveal, ToBeExact } from '../../../../../test_utilities/checkTypes';
import { useTraverseKeys } from '../../lib/helper-traverse-scheme-keys';

describe('Check types', () => {
  test('types are consistent', () => {
    const testIt = () => {
      const symbolKey = Symbol();
      const s01 = { 1: 'string', foo: true, [symbolKey]: 34 };

      const tu01 = useTraverseKeys(s01, (k, s, f1, f2) => {
        type KI = Reveal<ToBeExact<typeof k, 1 | 'foo' | typeof symbolKey>>;
        type SI = Reveal<ToBeExact<typeof s, typeof s01>>;
        type FI1 = Reveal<ToBeExact<typeof f1, (a: unknown) => void>>;
        type FI2 = Reveal<ToBeExact<typeof f2, (a: unknown) => void>>;
      });
      const tu02 = useTraverseKeys<
        { 1: string; foo: boolean; [symbolKey]: number | boolean },
        { 1: number; foo: boolean; [symbolKey]: unknown },
        { 1: number | object; foo: string; [symbolKey]: null }
      >(s01, (k, s, f1, f2) => {
        type KI = Reveal<ToBeExact<typeof k, 1 | 'foo' | typeof symbolKey>>;
        type SI = Reveal<
          ToBeExact<typeof s, { 1: string; foo: boolean; [symbolKey]: number | boolean }>
        >;
        type FI1 = Reveal<ToBeExact<typeof f1, (a: unknown) => void>>;
        type FI2 = Reveal<ToBeExact<typeof f2, (a: number | object | string | null) => void>>;
      });
      const tu03 = useTraverseKeys<
        { 1: string; foo: boolean },
        { 1: number; foo: boolean },
        { 1: number | object; foo: string }
      >(s01, (k, s, f1, f2) => {
        type KI = Reveal<ToBeExact<typeof k, 1 | 'foo'>>;
        type SI = Reveal<ToBeExact<typeof s, { 1: string; foo: boolean }>>;
        type FI1 = Reveal<ToBeExact<typeof f1, (a: number | boolean) => void>>;
        type FI2 = Reveal<ToBeExact<typeof f2, (a: number | object | string) => void>>;
      });
      type CU01 = Reveal<
        ToBeExact<
          typeof tu02,
          [
            { 1: number; foo: boolean; [symbolKey]: unknown },
            { 1: number | object; foo: string; [symbolKey]: null },
            (1 | 'foo' | typeof symbolKey)[]
          ]
        >
      >;
      type CU02 = Reveal<
        ToBeExact<
          typeof tu03,
          [{ 1: number; foo: boolean }, { 1: number | object; foo: string }, (1 | 'foo')[]]
        >
      >;
    };
  });
});
