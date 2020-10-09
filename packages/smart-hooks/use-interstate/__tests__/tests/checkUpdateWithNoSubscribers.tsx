import { fireEvent } from '@testing-library/react';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import { flagManager } from '../testFlags';
import type { TestDescription } from '../testsAssets';

const checkUpdateWithNoSubscribers: TestDescription = (p) => [
  'check update state with no subscribers',
  () => {
    const {
      assets: { render, useInterstate, wrapWithStrictModeComponent, executionCountersFactory },
    } = p;

    const testId0 = 'a';
    const subscribeId0 = 0;
    const counter = executionCountersFactory();

    const TestComponent: FC = wrapWithStrictModeComponent(() => {
      const [, updateState] = useInterstate(subscribeId0, '');

      useEffect(() => counter.count());

      return (
        <input
          {...{
            value: '',
            onChange: ({ target: { value } }) => {
              return updateState(value);
            },
            'data-testid': testId0,
          }}
        />
      );
    });

    const { unmount, getByTestId } = render(<TestComponent />);

    fireEvent.change(getByTestId(testId0), { target: { value: 'new' } });
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(counter.howManyTimesBeenCalled()).toBe(1);
    }

    fireEvent.change(getByTestId(testId0), { target: { value: 'newer' } });
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(counter.howManyTimesBeenCalled()).toBe(1);
    }

    fireEvent.change(getByTestId(testId0), { target: { value: 'newest' } });
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(counter.howManyTimesBeenCalled()).toBe(1);
    }

    unmount();
  },
];

export default checkUpdateWithNoSubscribers;
