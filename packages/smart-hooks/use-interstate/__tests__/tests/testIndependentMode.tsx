import React from 'react';
import { flagManager } from '../testFlags';
import type { TestDescription } from '../testsAssets';

const testIndependentMode: TestDescription = (p) => [
  'independent mode works',
  () => {
    const {
      assets: {
        render,
        settersCounterFactory,
        Scope,
        executionCountersFactory,
        getUseInterstate,
        composeCanListen,
        composeCanListenAndUpdate,
        CanListen,
        CanListenAndUpdate,
      },
    } = p;

    const { Scope: ScopeIndependent, useInterstate: useInterstateIndependent } = getUseInterstate();
    const CanListenIndependent = composeCanListen(useInterstateIndependent);
    const CanListenAndUpdateIndependent = composeCanListenAndUpdate(useInterstateIndependent);

    const subscribeId = 1;
    const testId1 = 'first';
    const testId2 = 'second';
    const testId3 = 'third';
    const testId4 = 'forth';
    const testId5 = 'fifth';
    const testId6 = 'sixth';
    const testId7 = 'seventh';
    const testId8 = 'eighth';
    const countRender1 = executionCountersFactory();
    const countRender2 = executionCountersFactory();
    const countRender3 = executionCountersFactory();
    const countRender4 = executionCountersFactory();
    const countRender5 = executionCountersFactory();
    const countRender6 = executionCountersFactory();
    const countRender7 = executionCountersFactory();
    const countRender8 = executionCountersFactory();

    const TestComponent: React.FunctionComponent<{}> = () => (
      <>
        <CanListen
          {...{ testId: testId1, subscribeId, countRender: countRender1.count, initialValue: '' }}
        />
        <CanListenAndUpdate
          {...{ testId: testId2, subscribeId, countRender: countRender2.count }}
        />
        <CanListenIndependent
          {...{ testId: testId3, subscribeId, countRender: countRender3.count, initialValue: '' }}
        />
        <CanListenAndUpdateIndependent
          {...{ testId: testId4, subscribeId, countRender: countRender4.count }}
        />
        <Scope>
          <ScopeIndependent>
            <CanListen
              {...{
                testId: testId5,
                subscribeId,
                countRender: countRender5.count,
                initialValue: '',
              }}
            />
            <CanListenAndUpdate
              {...{
                testId: testId6,
                subscribeId,
                countRender: countRender6.count,
              }}
            />
            <CanListenIndependent
              {...{
                testId: testId7,
                subscribeId,
                countRender: countRender7.count,
                initialValue: '',
              }}
            />
            <CanListenAndUpdateIndependent
              {...{
                testId: testId8,
                subscribeId,
                countRender: countRender8.count,
              }}
            />
          </ScopeIndependent>
        </Scope>
      </>
    );

    const { fireNode, getTextFromNode, unmount } = render(<TestComponent />);
    const countSetter1 = settersCounterFactory(0);
    const countSetter2 = settersCounterFactory(1);
    const countSetter3 = settersCounterFactory(2);
    const countSetter4 = settersCounterFactory(3);
    fireNode(testId2, 'bus');

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId1)).toBe('bus');
      expect(getTextFromNode(testId2)).toBe('bus');
      expect(getTextFromNode(testId3)).toBe('');
      expect(getTextFromNode(testId4)).toBe('');
      expect(getTextFromNode(testId5)).toBe('');
      expect(getTextFromNode(testId6)).toBe('');
      expect(getTextFromNode(testId7)).toBe('');
      expect(getTextFromNode(testId8)).toBe('');
    }

    fireNode(testId4, 'car');

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId1)).toBe('bus');
      expect(getTextFromNode(testId2)).toBe('bus');
      expect(getTextFromNode(testId3)).toBe('car');
      expect(getTextFromNode(testId4)).toBe('car');
      expect(getTextFromNode(testId5)).toBe('');
      expect(getTextFromNode(testId6)).toBe('');
      expect(getTextFromNode(testId7)).toBe('');
      expect(getTextFromNode(testId8)).toBe('');
    }

    fireNode(testId6, 'boat');

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId1)).toBe('bus');
      expect(getTextFromNode(testId2)).toBe('bus');
      expect(getTextFromNode(testId3)).toBe('car');
      expect(getTextFromNode(testId4)).toBe('car');
      expect(getTextFromNode(testId5)).toBe('boat');
      expect(getTextFromNode(testId6)).toBe('boat');
      expect(getTextFromNode(testId7)).toBe('');
      expect(getTextFromNode(testId8)).toBe('');
    }

    fireNode(testId8, 'plane');

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId1)).toBe('bus');
      expect(getTextFromNode(testId2)).toBe('bus');
      expect(getTextFromNode(testId3)).toBe('car');
      expect(getTextFromNode(testId4)).toBe('car');
      expect(getTextFromNode(testId5)).toBe('boat');
      expect(getTextFromNode(testId6)).toBe('boat');
      expect(getTextFromNode(testId7)).toBe('plane');
      expect(getTextFromNode(testId8)).toBe('plane');
    } else {
      expect(countRender1.howManyTimesBeenCalled()).toBe(2);
      expect(countRender2.howManyTimesBeenCalled()).toBe(2);
      expect(countRender3.howManyTimesBeenCalled()).toBe(2);
      expect(countRender4.howManyTimesBeenCalled()).toBe(2);
      expect(countRender5.howManyTimesBeenCalled()).toBe(2);
      expect(countRender6.howManyTimesBeenCalled()).toBe(2);
      expect(countRender7.howManyTimesBeenCalled()).toBe(2);
      expect(countRender8.howManyTimesBeenCalled()).toBe(2);
    }

    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(countSetter1(subscribeId)).toBe(2);
      expect(countSetter2(subscribeId)).toBe(2);
      expect(countSetter3(subscribeId)).toBe(2);
      expect(countSetter4(subscribeId)).toBe(2);
    }

    unmount();
    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(countSetter1(subscribeId)).toBe(0);
      expect(countSetter2(subscribeId)).toBe(0);
      expect(countSetter3(subscribeId)).toBe(0);
      expect(countSetter4(subscribeId)).toBe(0);
    }
  },
];

export default testIndependentMode;
