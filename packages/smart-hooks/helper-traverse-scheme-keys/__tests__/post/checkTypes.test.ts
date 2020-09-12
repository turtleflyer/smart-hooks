/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable symbol-description */
import type { Reveal, ToBeExact } from '../../../../../test_utilities/checkTypes';
import type { DeriveScheme, FulfillTraversingKeys } from '../../src/useTraverseKeys';
import { useTraverseKeys } from '../../lib/helper-traverse-scheme-keys';

describe('Check types', () => {
  test('types are consistent', () => {
    const testIt = () => {
      const symbolKey = Symbol();
      const s01 = { 1: 'string', foo: true, [symbolKey]: 34 };

      const tu01 = useTraverseKeys(s01, (k, s, f1, f2) => {
        type KIp1 = Reveal<ToBeExact<typeof k, 1 | 'foo' | typeof symbolKey>>;
        type SIp1 = Reveal<ToBeExact<typeof s, typeof s01>>;
        type FI101 = Reveal<
          ToBeExact<
            typeof f1,
            FulfillTraversingKeys<DeriveScheme<typeof s01>, 1 | 'foo' | typeof symbolKey>
          >
        >;
        type FI201 = Reveal<
          ToBeExact<
            typeof f2,
            FulfillTraversingKeys<DeriveScheme<typeof s01>, 1 | 'foo' | typeof symbolKey>
          >
        >;
      });
      const tu02 = useTraverseKeys<
        { 1: string; foo: boolean; [symbolKey]: number | boolean },
        { readonly 1: number; readonly foo: boolean; readonly [symbolKey]: unknown },
        { readonly 1: number | object; readonly foo: string; readonly [symbolKey]: null }
      >(s01, (k, s, f1, f2) => {
        type KIp1 = Reveal<ToBeExact<typeof k, 1 | 'foo' | typeof symbolKey>>;
        type SIp1 = Reveal<
          ToBeExact<typeof s, { 1: string; foo: boolean; [symbolKey]: number | boolean }>
        >;
        type FI101 = Reveal<
          ToBeExact<
            typeof f1,
            FulfillTraversingKeys<
              { readonly 1: number; readonly foo: boolean; readonly [symbolKey]: unknown },
              1 | 'foo' | typeof symbolKey
            >
          >
        >;
        type FI201 = Reveal<
          ToBeExact<
            typeof f2,
            FulfillTraversingKeys<
              { readonly 1: number | object; readonly foo: string; readonly [symbolKey]: null },
              1 | 'foo' | typeof symbolKey
            >
          >
        >;
      });
      const tu03 = useTraverseKeys<
        { 1: string; foo: boolean },
        { readonly 1: number; readonly foo: boolean },
        { readonly 1: number | object; readonly foo: string }
      >(s01, (k, s, f1, f2) => {
        type KIp1 = Reveal<ToBeExact<typeof k, 1 | 'foo'>>;
        type SIp1 = Reveal<ToBeExact<typeof s, { 1: string; foo: boolean }>>;
        type FI101 = Reveal<
          ToBeExact<
            typeof f1,
            FulfillTraversingKeys<{ readonly 1: number; readonly foo: boolean }, 1 | 'foo'>
          >
        >;
        type FI201 = Reveal<
          ToBeExact<
            typeof f2,
            FulfillTraversingKeys<{ readonly 1: number | object; readonly foo: string }, 1 | 'foo'>
          >
        >;
      });
      type CU01 = Reveal<
        ToBeExact<
          typeof tu01,
          [DeriveScheme<typeof s01>, DeriveScheme<typeof s01>, (1 | 'foo' | typeof symbolKey)[]]
        >
      >;
      type CU02 = Reveal<
        ToBeExact<
          typeof tu02,
          [
            { readonly 1: number; readonly foo: boolean; readonly [symbolKey]: unknown },
            { readonly 1: number | object; readonly foo: string; readonly [symbolKey]: null },
            (1 | 'foo' | typeof symbolKey)[]
          ]
        >
      >;
      type CU03 = Reveal<
        ToBeExact<
          typeof tu03,
          [
            { readonly 1: number; readonly foo: boolean },
            { readonly 1: number | object; readonly foo: string },
            (1 | 'foo')[]
          ]
        >
      >;
      type D01 = Reveal<
        ToBeExact<
          DeriveScheme<{ a: number; 2: string | boolean }>,
          { readonly a: unknown; readonly 2: unknown }
        >
      >;
      type F01 = Reveal<
        ToBeExact<
          FulfillTraversingKeys<{ a: number; 2: string | boolean }, 2>,
          (p: string | boolean) => void
        >
      >;
    };
  });
});
