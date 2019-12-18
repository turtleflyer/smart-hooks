import React from 'react';
import { TestDescription, ComposeCallback } from '../testsAssets';

const valuesRemainAfterTreeUnmount: TestDescription = (
  p,
  createTestComponents,
  shouldTestPerformance,
) => [
  'values remain after tree unmount',
  () => {
    const {
      assets: { render, getLastMap },
    } = p;
    const { CanListen, CanUpdate } = createTestComponents(p);
    const subscribeId = '1';
    const testId1 = 'updater';
    const testId2 = 'listener';
    const altComposeCallback: ComposeCallback = set => ({ target: { value } }) => {
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

    const { unmount, rerender, fireNode, getTextFromNode } = render(<TestComponent />);
    const map = getLastMap();
    expect(getTextFromNode(testId2)).toBe('');

    fireNode(testId1, 'g');
    fireNode(testId1, 'e');
    expect(getTextFromNode(testId2)).toBe('ge');
    if (shouldTestPerformance) {
      expect((map.get(subscribeId) as { setters: any[] }).setters.length).toBe(1);
    }

    unmount();
    if (shouldTestPerformance) {
      expect((map.get(subscribeId) as { setters: any[] }).setters.length).toBe(0);
    }

    rerender(<TestComponent />);
    expect(getTextFromNode(testId2)).toBe('ge');

    fireNode(testId1, 'f');
    fireNode(testId1, 'r');
    expect(getTextFromNode(testId2)).toBe('gefr');
    if (shouldTestPerformance) {
      expect((map.get(subscribeId) as { setters: any[] }).setters.length).toBe(1);
    }

    unmount();
    if (shouldTestPerformance) {
      expect((map.get(subscribeId) as { setters: any[] }).setters.length).toBe(0);
    }
  },
];

export default valuesRemainAfterTreeUnmount;
