import React from 'react';
import { flagManager } from '../testFlags';
import type { TestDescription } from '../testsAssets';

const dynamicSubscriptionWorks: TestDescription = (p) => [
  'dynamic subscription works',
  () => {
    const {
      assets: { render, settersCounterFactory, executionCountersFactory, CanListen, CanUpdate },
    } = p;

    const subscribeId1 = Symbol('1');
    const subscribeId2 = Symbol('2');
    const subscribeId3 = Symbol('3');
    const testId1 = 'a';
    const testId2 = 'b';
    const testId3 = 'c';
    const testId4 = 'd';
    const countRender1 = executionCountersFactory();
    const countRender2 = executionCountersFactory();
    const countRender3 = executionCountersFactory();
    const countRender4 = executionCountersFactory();

    const TestComponent: React.FunctionComponent<{
      initV1?: string;
      dynamicSubscribe: number | string | symbol;
      initV2?: string | (() => string);
    }> = ({ initV1 = 'sun', dynamicSubscribe, initV2 = undefined }) => {
      return (
        <>
          <CanUpdate
            {...{
              subscribeId: subscribeId1,
              testId: testId1,
              countRender: countRender1.count,
              initialValue: initV1,
            }}
          >
            <CanUpdate
              {...{
                subscribeId: dynamicSubscribe,
                testId: testId2,
                countRender: countRender2.count,
                initialValue: initV2,
              }}
            />
            <CanListen
              {...{
                subscribeId: subscribeId1,
                testId: testId3,
                countRender: countRender3.count,
              }}
            />
          </CanUpdate>
          <CanListen
            {...{
              subscribeId: dynamicSubscribe,
              testId: testId4,
              countRender: countRender4.count,
            }}
          />
        </>
      );
    };

    const { rerender, fireNode, getTextFromNode, unmount } = render(
      <TestComponent dynamicSubscribe={subscribeId1} />
    );
    const settersCounter = settersCounterFactory();

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId3)).toBe('sun');
      expect(getTextFromNode(testId4)).toBe('sun');
    }

    fireNode(testId1, 'venus');

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId3)).toBe('venus');
      expect(getTextFromNode(testId4)).toBe('venus');
    } else {
      expect(countRender1.howManyTimesBeenCalled()).toBe(1);
      expect(countRender2.howManyTimesBeenCalled()).toBe(1);
      expect(countRender3.howManyTimesBeenCalled()).toBe(2);
      expect(countRender4.howManyTimesBeenCalled()).toBe(2);
    }

    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId1)).toBe(2);
    }

    rerender(<TestComponent dynamicSubscribe={subscribeId2} initV2="moon" />);

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId3)).toBe('venus');
      expect(getTextFromNode(testId4)).toBe('moon');
    }

    fireNode(testId1, 'saturn');
    fireNode(testId2, 'jupiter');

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId3)).toBe('saturn');
      expect(getTextFromNode(testId4)).toBe('jupiter');
    } else {
      expect(countRender1.howManyTimesBeenCalled()).toBe(2);
      expect(countRender2.howManyTimesBeenCalled()).toBe(2);
      expect(countRender3.howManyTimesBeenCalled()).toBe(4);
      expect(countRender4.howManyTimesBeenCalled()).toBe(4);
    }

    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId1)).toBe(1);
      expect(settersCounter(subscribeId2)).toBe(1);
    }

    rerender(<TestComponent dynamicSubscribe={subscribeId3} initV2={() => 'mars'} />);

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId3)).toBe('saturn');
      expect(getTextFromNode(testId4)).toBe('mars');
    }
    fireNode(testId1, 'uranus');
    fireNode(testId2, 'mercury');

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId3)).toBe('uranus');
      expect(getTextFromNode(testId4)).toBe('mercury');
    } else {
      expect(countRender1.howManyTimesBeenCalled()).toBe(3);
      expect(countRender2.howManyTimesBeenCalled()).toBe(3);
      expect(countRender3.howManyTimesBeenCalled()).toBe(6);
      expect(countRender4.howManyTimesBeenCalled()).toBe(6);
    }

    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId1)).toBe(1);
      expect(settersCounter(subscribeId2)).toBe(0);
      expect(settersCounter(subscribeId3)).toBe(1);
    }

    rerender(<TestComponent dynamicSubscribe={subscribeId1} initV2="earth" />);

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId3)).toBe('uranus');
      expect(getTextFromNode(testId4)).toBe('uranus');
    }

    fireNode(testId1, 'vega');
    fireNode(testId2, 'pluto');

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId3)).toBe('pluto');
      expect(getTextFromNode(testId4)).toBe('pluto');
    } else {
      expect(countRender1.howManyTimesBeenCalled()).toBe(4);
      expect(countRender2.howManyTimesBeenCalled()).toBe(4);
      expect(countRender3.howManyTimesBeenCalled()).toBe(9);
      expect(countRender4.howManyTimesBeenCalled()).toBe(9);
    }

    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId1)).toBe(2);
      expect(settersCounter(subscribeId2)).toBe(0);
      expect(settersCounter(subscribeId3)).toBe(0);
    }

    rerender(<TestComponent dynamicSubscribe={subscribeId2} initV2="aldebaran" />);

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId3)).toBe('pluto');
      expect(getTextFromNode(testId4)).toBe('jupiter');
    }

    fireNode(testId1, 'black hole');
    fireNode(testId2, 'comet');

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId3)).toBe('black hole');
      expect(getTextFromNode(testId4)).toBe('comet');
    } else {
      expect(countRender1.howManyTimesBeenCalled()).toBe(5);
      expect(countRender2.howManyTimesBeenCalled()).toBe(5);
      expect(countRender3.howManyTimesBeenCalled()).toBe(11);
      expect(countRender4.howManyTimesBeenCalled()).toBe(11);
    }

    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId1)).toBe(1);
      expect(settersCounter(subscribeId2)).toBe(1);
      expect(settersCounter(subscribeId3)).toBe(0);
    }

    unmount();
    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId1)).toBe(0);
      expect(settersCounter(subscribeId2)).toBe(0);
      expect(settersCounter(subscribeId3)).toBe(0);
    }
  },
];

export default dynamicSubscriptionWorks;
