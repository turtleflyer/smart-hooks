/* eslint-disable no-param-reassign */
/* eslint-disable symbol-description */
import { render } from '@testing-library/react';
import type { FC } from 'react';
import React from 'react';
import type { UseEachKeyProceed, UseTraverseReturn } from '../../src/useTraverseKeys';
import type { TestDescription } from '../testsAssets';

const testHelper: TestDescription = (p) => [
  'test helper works right',
  () => {
    const {
      assets: { useTraverseKeys, wrapWithStrictModeComponent },
    } = p;

    interface TestComponentProps<
      S extends Record<keyof never, unknown>,
      StateSide extends Record<keyof S, unknown>,
      SettersSide extends Record<keyof S, unknown>
    > {
      scheme: S;

      eachKeyProceed: UseEachKeyProceed<S, StateSide, SettersSide>;

      memReturn: { current: Readonly<UseTraverseReturn<S, StateSide, SettersSide>> };
    }

    type TestComponentType = <
      S extends Record<keyof never, unknown>,
      StateSide extends Record<keyof S, unknown>,
      SettersSide extends Record<keyof S, unknown>
    >(
      props: TestComponentProps<S, StateSide, SettersSide>
    ) => ReturnType<FC>;

    const TestComponent: TestComponentType = wrapWithStrictModeComponent(
      ({ scheme, eachKeyProceed, memReturn }) => {
        memReturn.current = useTraverseKeys(scheme, eachKeyProceed);

        return <></>;
      }
    );

    const symbolKey = Symbol();

    const scheme1 = { a: 1, 2: 'hi', [symbolKey]: false };
    const memReturn1 = {} as {
      current: UseTraverseReturn<typeof scheme1>;
    };

    const { rerender, unmount } = render(
      <TestComponent
        scheme={scheme1}
        eachKeyProceed={(key, sch, f1, f2) => {
          f1(`a${sch[key].toString()}`);
          f2(`b${sch[key].toString()}`);
        }}
        memReturn={memReturn1}
      />
    );

    expect(memReturn1.current[0]).toEqual({ a: 'a1', 2: 'ahi', [symbolKey]: 'afalse' });
    expect(memReturn1.current[1]).toEqual({ a: 'b1', 2: 'bhi', [symbolKey]: 'bfalse' });
    expect(
      (() => memReturn1.current[2].map((e) => ['a', '2', symbolKey].includes(e as never)))()
    ).toEqual([true, true, true]);

    const scheme2 = { b: false };
    const memReturn2 = {} as {
      current: UseTraverseReturn<typeof scheme1>;
    };

    rerender(
      <TestComponent
        scheme={(scheme2 as unknown) as typeof scheme1}
        eachKeyProceed={(key, sch, f1, f2) => {
          f1(`c${sch[key].toString()}`);
          f2(`d${sch[key].toString()}`);
        }}
        memReturn={memReturn2}
      />
    );

    expect(memReturn2.current[0]).toEqual({ a: 'c1', 2: 'chi', [symbolKey]: 'cfalse' });
    expect(memReturn2.current[1]).toEqual({ a: 'd1', 2: 'dhi', [symbolKey]: 'dfalse' });
    expect(
      (() => memReturn2.current[2].map((e) => ['a', '2', symbolKey].includes(e as never)))()
    ).toEqual([true, true, true]);
    expect(memReturn2.current[1]).toBe(memReturn1.current[1]);

    unmount();
  },
];

export default testHelper;
