import React, { useCallback, useState } from 'react';
import { TestDescription } from '../testsAssets';
import { flagManager } from '../testFlags';
import { InterstateInitializeParam } from '../../src/useInterstate';
import { fireEvent } from '@testing-library/react';

const dynamicSubscriptionWorks: TestDescription = (p) => [
  'dynamic subscription works',
  () => {
    const {
      assets: {
        render,
        settersCounterFactory,
        executionCountersFactory,
        CanListen,
        CanUpdate,
        CanListenAndUpdate,
      },
    } = p;

    const subscribeId1 = '1';
    const subscribeId2 = '2';
    const testId1 = 'a';
    const testId2 = 'b';
    const testId3 = 'c';
    const testId4 = 'd';
    const testId5 = 'e';
    const testId6 = 'f';
    const countRender1 = executionCountersFactory();
    const countRender2 = executionCountersFactory();
    const countRender3 = executionCountersFactory();
    const countRender4 = executionCountersFactory();
    const countRender5 = executionCountersFactory();

    const Dynamic = () => {
      const [subscribeId, setSubscribeId] = useState(subscribeId1);
      const [initialValue, setInitialValue] = useState<InterstateInitializeParam<string>>();

      const scenario = useCallback(({ target: { value } }) => {
        switch (value) {
          case '1':
            setSubscribeId(subscribeId1);
            setInitialValue(undefined);
            break;

          case '2':
            setSubscribeId(subscribeId2);
            break;

          case '3':
            setSubscribeId(subscribeId1);
            setInitialValue('mars');
            break;

          case '4':
            setInitialValue('neptune');
            break;

          case '5':
            setSubscribeId(subscribeId1);
            setInitialValue(() => () => 'black star');
            break;

          default:
            break;
        }
      }, []);

      return (
        <>
          <CanListenAndUpdate
            {...{
              testId: testId4,
              countRender: countRender4.count,
              subscribeId,
              initialValue,
            }}
          />
          <input value="" onChange={scenario} data-testid={testId6} />
        </>
      );
    };

    const TestComponent: React.FunctionComponent<{
      initV1?: string;
      initV2?: string;
    }> = ({ initV1 = 'sun', initV2 = 'moon' }) => (
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
              subscribeId: subscribeId2,
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
        <Dynamic />
        <CanListen
          {...{
            subscribeId: subscribeId1,
            testId: testId5,
            countRender: countRender5.count,
          }}
        />
      </>
    );

    const { fireNode, getTextFromNode, getByTestId, unmount } = render(<TestComponent />);
    const settersCounter = settersCounterFactory();
    expect(getTextFromNode(testId3)).toBe('sun');
    expect(getTextFromNode(testId4)).toBe('sun');
    expect(getTextFromNode(testId5)).toBe('sun');
    fireNode(testId4, 'venus');
    expect(getTextFromNode(testId3)).toBe('venus');
    expect(getTextFromNode(testId4)).toBe('venus');
    expect(getTextFromNode(testId5)).toBe('venus');
    expect(countRender1.howManyTimesBeenCalled()).toBe(1);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(2);
    expect(countRender4.howManyTimesBeenCalled()).toBe(2);
    expect(countRender5.howManyTimesBeenCalled()).toBe(2);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId1)).toBe(3);
      expect(settersCounter(subscribeId2)).toBe(0);
    }

    fireEvent.change(getByTestId(testId6), { target: { value: '2' } });
    expect(getTextFromNode(testId3)).toBe('venus');
    expect(getTextFromNode(testId4)).toBe('moon');
    expect(getTextFromNode(testId5)).toBe('venus');
    fireNode(testId1, 'saturn');
    fireNode(testId2, 'jupiter');
    expect(getTextFromNode(testId3)).toBe('saturn');
    expect(getTextFromNode(testId4)).toBe('jupiter');
    expect(getTextFromNode(testId5)).toBe('saturn');
    expect(countRender1.howManyTimesBeenCalled()).toBe(1);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(3);
    expect(countRender4.howManyTimesBeenCalled()).toBe(4);
    expect(countRender5.howManyTimesBeenCalled()).toBe(3);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId1)).toBe(2);
      expect(settersCounter(subscribeId2)).toBe(1);
    }

    fireEvent.change(getByTestId(testId6), { target: { value: '3' } });
    expect(getTextFromNode(testId3)).toBe('mars');
    expect(getTextFromNode(testId4)).toBe('mars');
    expect(getTextFromNode(testId5)).toBe('mars');
    fireNode(testId1, 'uranus');
    fireNode(testId2, 'mercury');
    expect(getTextFromNode(testId3)).toBe('uranus');
    expect(getTextFromNode(testId4)).toBe('uranus');
    expect(getTextFromNode(testId5)).toBe('uranus');
    expect(countRender1.howManyTimesBeenCalled()).toBe(1);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(5);
    expect(countRender4.howManyTimesBeenCalled()).toBe(6);
    expect(countRender5.howManyTimesBeenCalled()).toBe(5);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId1)).toBe(3);
      expect(settersCounter(subscribeId2)).toBe(0);
    }

    fireEvent.change(getByTestId(testId6), { target: { value: '1' } });
    expect(getTextFromNode(testId3)).toBe('uranus');
    expect(getTextFromNode(testId4)).toBe('uranus');
    expect(getTextFromNode(testId5)).toBe('uranus');
    expect(countRender1.howManyTimesBeenCalled()).toBe(1);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(5);
    expect(countRender4.howManyTimesBeenCalled()).toBe(7);
    expect(countRender5.howManyTimesBeenCalled()).toBe(5);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId1)).toBe(3);
      expect(settersCounter(subscribeId2)).toBe(0);
    }

    fireEvent.change(getByTestId(testId6), { target: { value: '2' } });
    expect(getTextFromNode(testId3)).toBe('uranus');
    expect(getTextFromNode(testId4)).toBe('mercury');
    expect(getTextFromNode(testId5)).toBe('uranus');
    expect(countRender1.howManyTimesBeenCalled()).toBe(1);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(5);
    expect(countRender4.howManyTimesBeenCalled()).toBe(8);
    expect(countRender5.howManyTimesBeenCalled()).toBe(5);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId1)).toBe(2);
      expect(settersCounter(subscribeId2)).toBe(1);
    }

    fireEvent.change(getByTestId(testId6), { target: { value: '4' } });
    expect(getTextFromNode(testId3)).toBe('uranus');
    expect(getTextFromNode(testId4)).toBe('mercury');
    expect(getTextFromNode(testId5)).toBe('uranus');
    expect(countRender1.howManyTimesBeenCalled()).toBe(1);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(5);
    expect(countRender4.howManyTimesBeenCalled()).toBe(9);
    expect(countRender5.howManyTimesBeenCalled()).toBe(5);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId1)).toBe(2);
      expect(settersCounter(subscribeId2)).toBe(1);
    }

    fireEvent.change(getByTestId(testId6), { target: { value: '1' } });
    expect(getTextFromNode(testId3)).toBe('uranus');
    expect(getTextFromNode(testId4)).toBe('uranus');
    expect(getTextFromNode(testId5)).toBe('uranus');
    expect(countRender1.howManyTimesBeenCalled()).toBe(1);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(5);
    expect(countRender4.howManyTimesBeenCalled()).toBe(10);
    expect(countRender5.howManyTimesBeenCalled()).toBe(5);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId1)).toBe(3);
      expect(settersCounter(subscribeId2)).toBe(0);
    }

    fireEvent.change(getByTestId(testId6), { target: { value: '3' } });
    expect(getTextFromNode(testId3)).toBe('uranus');
    expect(getTextFromNode(testId4)).toBe('uranus');
    expect(getTextFromNode(testId5)).toBe('uranus');
    expect(countRender1.howManyTimesBeenCalled()).toBe(1);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(5);
    expect(countRender4.howManyTimesBeenCalled()).toBe(11);
    expect(countRender5.howManyTimesBeenCalled()).toBe(5);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId1)).toBe(3);
      expect(settersCounter(subscribeId2)).toBe(0);
    }

    fireEvent.change(getByTestId(testId6), { target: { value: '2' } });
    expect(getTextFromNode(testId3)).toBe('uranus');
    expect(getTextFromNode(testId4)).toBe('mars');
    expect(getTextFromNode(testId5)).toBe('uranus');
    expect(countRender1.howManyTimesBeenCalled()).toBe(1);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(5);
    expect(countRender4.howManyTimesBeenCalled()).toBe(12);
    expect(countRender5.howManyTimesBeenCalled()).toBe(5);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId1)).toBe(2);
      expect(settersCounter(subscribeId2)).toBe(1);
    }

    fireEvent.change(getByTestId(testId6), { target: { value: '5' } });
    expect(getTextFromNode(testId3)).toBe('black star');
    expect(getTextFromNode(testId4)).toBe('black star');
    expect(getTextFromNode(testId5)).toBe('black star');
    expect(countRender1.howManyTimesBeenCalled()).toBe(1);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(6);
    expect(countRender4.howManyTimesBeenCalled()).toBe(13);
    expect(countRender5.howManyTimesBeenCalled()).toBe(6);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId1)).toBe(3);
      expect(settersCounter(subscribeId2)).toBe(0);
    }

    unmount();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId1)).toBe(0);
      expect(settersCounter(subscribeId2)).toBe(0);
    }
  },
];

export default dynamicSubscriptionWorks;
