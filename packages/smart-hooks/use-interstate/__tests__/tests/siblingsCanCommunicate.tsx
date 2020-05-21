import React from 'react';
import { TestDescription } from '../testsAssets';
import { flagManager } from '../testFlags';

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
    const TestComponent: React.FunctionComponent<{ initV: string }> = ({ initV }) => (
      <>
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
      </>
    );

    const { unmount, fireNode, getTextFromNode } = render(<TestComponent initV="" />);
    const settersCounter = settersCounterFactory();
    expect(getTextFromNode(testId2)).toBe('');

    fireNode(testId1, 'cat');
    expect(getTextFromNode(testId2)).toBe('cat');
    expect(countRender1.howManyTimesBeenCalled()).toBe(1);
    expect(countRender2.howManyTimesBeenCalled()).toBe(2);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId)).toBe(1);
    }

    unmount();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId)).toBe(0);
    }
  },
];

export default siblingsCanCommunicate;
