import React from 'react';
import { TestDescription, ComposeCallback } from '../testsAssets';
import { flagManager } from '../testFlags';

const valuesRemainAfterTreeUnmount: TestDescription = p => [
  'values remain after tree unmount',
  () => {
    const {
      assets: { render, getCountSetters, CanListen, CanUpdate },
    } = p;
    const subscribeId = '1';
    const testId1 = 'updater';
    const testId2 = 'listener';
    const altComposeCallback: ComposeCallback = set => ({
      target: { value },
    }) => {
      set((old: string) => (old || '') + value);
    };
    const TestComponent = () => (
      <>
        <CanUpdate
          {...{
            subscribeId,
            testId: testId1,
            composeCallback: altComposeCallback,
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

    const { unmount, rerender, fireNode, getTextFromNode } = render(
      <TestComponent />
    );
    const countSetter = getCountSetters();
    expect(getTextFromNode(testId2)).toBe('');

    fireNode(testId1, 'g');
    fireNode(testId1, 'e');
    expect(getTextFromNode(testId2)).toBe('ge');
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(countSetter(subscribeId)).toBe(1);
    }

    unmount();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(countSetter(subscribeId)).toBe(0);
    }

    rerender(<TestComponent />);
    expect(getTextFromNode(testId2)).toBe('ge');

    fireNode(testId1, 'f');
    fireNode(testId1, 'r');
    expect(getTextFromNode(testId2)).toBe('gefr');
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(countSetter(subscribeId)).toBe(1);
    }

    unmount();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(countSetter(subscribeId)).toBe(0);
    }
  },
];

export default valuesRemainAfterTreeUnmount;
