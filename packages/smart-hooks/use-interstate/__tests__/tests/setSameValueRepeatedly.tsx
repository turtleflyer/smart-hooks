import { fireEvent } from '@testing-library/react';
import type { FC } from 'react';
import React from 'react';
import { flagManager } from '../testFlags';
import type { TestDescription } from '../testsAssets';

const setSameValueRepeatedly: TestDescription = (p) => [
  'check if setting the same value does not result in error',
  () => {
    const {
      assets: { render, CanListenAndUpdate, useInterstate, executionCountersFactory },
    } = p;
    const subscribeId = '1';
    const testId1 = 'first';
    const testId2 = 'second';
    const countRender = executionCountersFactory();

    const UpdateWitFunctionValue: FC = () => {
      const [, updateState] = useInterstate<string>(subscribeId);

      return (
        <input
          {...{
            value: '',
            onChange: ({ target: { value } }) =>
              updateState({ north: () => 'pole', south: () => 'pole' }[value as 'north' | 'south']),
            'data-testid': testId2,
          }}
        />
      );
    };

    const TestComponent: FC = () => (
      <>
        <CanListenAndUpdate
          {...{
            countRender: countRender.count,
            subscribeId,
            testId: testId1,
            initialValue: '',
          }}
        />
        <UpdateWitFunctionValue />
      </>
    );

    const { fireNode, getTextFromNode, unmount, getByTestId } = render(<TestComponent />);

    fireNode(testId1, 'A');
    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId1)).toBe('A');
    } else {
      expect(countRender.howManyTimesBeenCalled()).toBe(2);
    }

    fireNode(testId1, 'A');
    fireNode(testId1, 'A');
    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId1)).toBe('A');
    } else {
      expect(countRender.howManyTimesBeenCalled()).toBe(2);
    }

    fireNode(testId1, 'B');
    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId1)).toBe('B');
    } else {
      expect(countRender.howManyTimesBeenCalled()).toBe(3);
    }

    fireEvent.change(getByTestId(testId2), { target: { value: 'north' } });
    fireEvent.change(getByTestId(testId2), { target: { value: 'south' } });
    fireEvent.change(getByTestId(testId2), { target: { value: 'north' } });
    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId1)).toBe('pole');
    } else {
      expect(countRender.howManyTimesBeenCalled()).toBe(4);
    }

    unmount();
  },
];

export default setSameValueRepeatedly;
