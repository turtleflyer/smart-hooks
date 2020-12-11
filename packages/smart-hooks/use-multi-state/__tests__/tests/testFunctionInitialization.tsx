/* eslint-disable no-param-reassign */
import { render } from '@testing-library/react';
import type { FC } from 'react';
import React from 'react';
import type { InitStateObject } from '../../src/useMultiState';
import type { TestDescription } from '../testsAssets';

const testFunctionInitialization: TestDescription = (p) => [
  'test initializing useMultiState using functions',
  () => {
    const {
      assets: { wrapWithStrictModeComponent, useMultiState },
    } = p;

    interface MainState {
      words: string[];
      method?: (...args: never[]) => unknown;
    }

    interface RecordState {
      current: MainState;
    }

    const TestComponent: FC<{
      initState: InitStateObject<MainState>;
      recordState: RecordState;
    }> = wrapWithStrictModeComponent(({ initState, recordState }) => {
      const [state] = useMultiState(initState);
      recordState.current = state;
      return <></>;
    });

    const recordState = {} as RecordState;

    let { unmount } = render(
      <TestComponent {...{ initState: { words: ['one', 'home'] }, recordState }} />
    );

    expect(recordState.current).toEqual({ words: ['one', 'home'], methods: undefined });

    ({ unmount } = render(
      <TestComponent
        {...{ initState: { words: () => ['no', 'yes'], methods: () => {} }, recordState }}
      />
    ));

    expect(recordState.current).toEqual({ words: ['no', 'yes'], methods: undefined });

    unmount();

    const initStateOfMethods = () => 2 * 2;

    ({ unmount } = render(
      <TestComponent
        {...{
          initState: { words: () => ['sorry'], methods: () => initStateOfMethods },
          recordState,
        }}
      />
    ));

    expect(recordState.current).toEqual({ words: ['sorry'], methods: initStateOfMethods });

    unmount();
  },
];

export default testFunctionInitialization;
