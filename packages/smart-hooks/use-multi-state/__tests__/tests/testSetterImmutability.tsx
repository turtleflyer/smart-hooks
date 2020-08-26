import { render } from '@testing-library/react';
import React from 'react';
import type { FC } from 'react';
import type { SettersObject } from '../../src/useMultiState';
import type { TestDescription } from '../testsAssets';

const testSetterImmutability: TestDescription = (p) => [
  'test setter is immutable',
  () => {
    const {
      assets: { useMultiState, wrapWithStrictModeComponent },
    } = p;

    const age = Symbol('age');

    interface MainState {
      mother: string;
      father: string;
      [age]: number | undefined;
      1000: boolean;
    }

    let memSetter!: SettersObject<MainState>;

    const TestComponent: FC<{
      initState: MainState;
    }> = wrapWithStrictModeComponent(({ initState }) => {
      const [, setState] = useMultiState(initState);
      memSetter = setState;
      return <></>;
    });

    const { rerender, unmount } = render(
      <TestComponent
        initState={{
          mother: 'N/A',
          father: 'N/A',
          [age]: undefined,
          1000: true,
        }}
      />
    );
    const memSetterFirst = memSetter;
    const memSetterMethods = { ...memSetter };

    rerender(
      <TestComponent
        initState={{
          mother: 'human',
          father: 'spider',
          [age]: 120,
          1000: true,
        }}
      />
    );
    expect(memSetter).toBe(memSetterFirst);
    expect(memSetter.mother).toBe(memSetterMethods.mother);
    expect(memSetter.father).toBe(memSetterMethods.father);
    expect(memSetter[age]).toBe(memSetterMethods[age]);
    expect(memSetter[1000]).toBe(memSetterMethods[1000]);

    unmount();
  },
];

export default testSetterImmutability;
