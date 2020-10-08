import type { FC } from 'react';
import React, { StrictMode } from 'react';
import { flagManager } from '../testFlags';
import type { TestDescription } from '../testsAssets';

const siblingsCanCommunicate: TestDescription = (p) => [
  'siblings can communicate',
  () => {
    const {
      assets: { render, settersCounterFactory, executionCountersFactory, CanListen, CanUpdate },
    } = p;
    const subscribeId = '1';
    const testId1 = 'updater';
    const testId2 = 'listener';
    const countRender1 = executionCountersFactory();
    const countRender2 = executionCountersFactory();
    const TestComponent: FC<{ initV: string }> = ({ initV }) => (
      <StrictMode>
        <CanUpdate
          {...{
            countRender: countRender1.count,
            subscribeId,
            testId: testId1,
            initialValue: initV,
          }}
        />
        <CanListen
          {...{
            countRender: countRender2.count,
            subscribeId,
            testId: testId2,
          }}
        />
      </StrictMode>
    );

    const { unmount, fireNode, getTextFromNode } = render(<TestComponent initV="" />);
    const settersCounter = settersCounterFactory();

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId2)).toBe('');
    } else {
      expect(countRender1.howManyTimesBeenCalled()).toBe(1);
      expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    }

    fireNode(testId1, 'cat');

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId2)).toBe('cat');
    } else {
      expect(countRender1.howManyTimesBeenCalled()).toBe(1);
      expect(countRender2.howManyTimesBeenCalled()).toBe(2);
    }

    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId)).toBe(1);
    }

    unmount();
    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId)).toBe(0);
    }
  },
];

export default siblingsCanCommunicate;
