import React, { useRef, useState, useEffect } from 'react';
import { TestDescription } from '../testsAssets';
import { flagManager } from '../testFlags';

const checkRerenderOptimization: TestDescription = (p) => [
  'Rerender optimization works',
  () => {
    const {
      assets: { render, settersCounterFactory, executionCountersFactory, CanListen },
    } = p;

    const subscribeId = 1;
    const testId1 = 'first';
    const testId2 = 'second';
    const testId3 = 'third';
    const testId4 = 'forth';
    const countRender1 = executionCountersFactory();
    const countRender2 = executionCountersFactory();
    const countRender3 = executionCountersFactory();
    const countRender4 = executionCountersFactory();

    const WrapBlinkControl: React.FunctionComponent = ({ children }) => {
      const memState = useRef(true);
      const [curCase, setCase] = useState(false);

      useEffect(() => {
        const { current: curMemState } = memState;
        if (curCase !== curMemState) {
          setCase((e) => !e);
        } else {
          memState.current = !curMemState;
        }
      });

      return <>{memState.current === curCase ? children : null}</>;
    };

    const TestComponent: React.FunctionComponent<{
      initV1?: string;
      initV2?: string;
      initV3?: string;
      initV4?: string;
    }> = ({ initV1, initV2, initV3, initV4 }) => (
      <WrapBlinkControl>
        <CanListen
          {...{
            subscribeId,
            testId: testId1,
            countRender: countRender1.count,
            initialValue: initV1,
          }}
        />
        <CanListen
          {...{
            subscribeId,
            testId: testId2,
            countRender: countRender2.count,
            initialValue: initV2,
          }}
        >
          <CanListen
            {...{
              subscribeId,
              testId: testId3,
              countRender: countRender3.count,
              initialValue: initV3,
            }}
          />
          <CanListen
            {...{
              subscribeId,
              testId: testId4,
              countRender: countRender4.count,
              initialValue: initV4,
            }}
          />
        </CanListen>
      </WrapBlinkControl>
    );

    const settersCounter = settersCounterFactory();
    const { getTextFromNode, rerender, unmount } = render(<TestComponent initV1="monkey" />);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId)).toBe(4);
    }
    expect(getTextFromNode(testId1)).toBe('monkey');
    expect(getTextFromNode(testId2)).toBe('monkey');
    expect(getTextFromNode(testId3)).toBe('monkey');
    expect(getTextFromNode(testId4)).toBe('monkey');
    expect(countRender1.howManyTimesBeenCalled()).toBe(1);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(1);
    expect(countRender4.howManyTimesBeenCalled()).toBe(1);

    rerender(<TestComponent />);
    expect(getTextFromNode(testId1)).toBe('monkey');
    expect(getTextFromNode(testId2)).toBe('monkey');
    expect(getTextFromNode(testId3)).toBe('monkey');
    expect(getTextFromNode(testId4)).toBe('monkey');
    expect(countRender1.howManyTimesBeenCalled()).toBe(2);
    expect(countRender2.howManyTimesBeenCalled()).toBe(2);
    expect(countRender3.howManyTimesBeenCalled()).toBe(2);
    expect(countRender4.howManyTimesBeenCalled()).toBe(2);

    rerender(<TestComponent initV2="bird" />);
    expect(getTextFromNode(testId1)).toBe('bird');
    expect(getTextFromNode(testId2)).toBe('bird');
    expect(getTextFromNode(testId3)).toBe('bird');
    expect(getTextFromNode(testId4)).toBe('bird');
    expect(countRender1.howManyTimesBeenCalled()).toBe(4);
    expect(countRender2.howManyTimesBeenCalled()).toBe(3);
    expect(countRender3.howManyTimesBeenCalled()).toBe(3);
    expect(countRender4.howManyTimesBeenCalled()).toBe(3);

    rerender(<TestComponent initV3="mouse" />);
    expect(getTextFromNode(testId1)).toBe('mouse');
    expect(getTextFromNode(testId2)).toBe('mouse');
    expect(getTextFromNode(testId3)).toBe('mouse');
    expect(getTextFromNode(testId4)).toBe('mouse');
    expect(countRender1.howManyTimesBeenCalled()).toBe(6);
    expect(countRender2.howManyTimesBeenCalled()).toBe(5);
    expect(countRender3.howManyTimesBeenCalled()).toBe(4);
    expect(countRender4.howManyTimesBeenCalled()).toBe(4);

    rerender(<TestComponent initV4="bug" />);
    expect(getTextFromNode(testId1)).toBe('bug');
    expect(getTextFromNode(testId2)).toBe('bug');
    expect(getTextFromNode(testId3)).toBe('bug');
    expect(getTextFromNode(testId4)).toBe('bug');
    expect(countRender1.howManyTimesBeenCalled()).toBe(8);
    expect(countRender2.howManyTimesBeenCalled()).toBe(7);
    expect(countRender3.howManyTimesBeenCalled()).toBe(6);
    expect(countRender4.howManyTimesBeenCalled()).toBe(5);

    unmount();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId)).toBe(0);
    }
  },
];

export default checkRerenderOptimization;
