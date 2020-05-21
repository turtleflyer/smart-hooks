import React from 'react';
import { TestDescription, ComposeCallback } from '../testsAssets';
import { flagManager } from '../testFlags';

const valuesRemainAfterTreeUnmount: TestDescription = (p) => [
  'values remain after tree unmount',
  () => {
    const {
      assets: { render, settersCounterFactory, CanListen, CanUpdate },
    } = p;
    const subscribeId = '1';
    const testId1 = 'updater';
    const testId2 = 'listener';
    const altComposeCallback: ComposeCallback = (set) => ({ target: { value } }) => {
      set((old: string) => (old || '') + value);
    };
    const TestComponent: React.FunctionComponent<{ initV?: string }> = ({ initV }) => (
      <>
        <CanUpdate
          {...{
            subscribeId,
            testId: testId1,
            composeCallback: altComposeCallback,
            initialValue: initV,
          }}
        />
        <CanListen
          {...{
            subscribeId,
            testId: testId2,
          }}
        />
      </>
    );

    const { unmount, rerender, fireNode, getTextFromNode } = render(<TestComponent initV="a" />);
    const settersCounter = settersCounterFactory();
    expect(getTextFromNode(testId2)).toBe('a');

    fireNode(testId1, 'g');
    fireNode(testId1, 'e');
    expect(getTextFromNode(testId2)).toBe('age');
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId)).toBe(1);
    }

    unmount();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId)).toBe(0);
    }

    rerender(<TestComponent />);
    expect(getTextFromNode(testId2)).toBe('age');

    fireNode(testId1, 'f');
    fireNode(testId1, 'r');
    expect(getTextFromNode(testId2)).toBe('agefr');
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId)).toBe(1);
    }

    unmount();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(settersCounter(subscribeId)).toBe(0);
    }
  },
];

export default valuesRemainAfterTreeUnmount;
