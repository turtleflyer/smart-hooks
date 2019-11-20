import React from 'react';
import { TestDescription } from '../testsAssets';

const siblingsCanCommunicate: TestDescription = (
  p,
  createTestComponents,
  shouldTestPerformance,
) => [
  'siblings can communicate',
  () => {
    const {
      assets: { render, getLastMap, executionCountersFactory },
    } = p;
    const { CanListen, CanUpdate } = createTestComponents(p);
    const subscribeId = '1';
    const testId1 = 'updater';
    const testId2 = 'listener';
    const countRender1 = executionCountersFactory();
    const countRender2 = executionCountersFactory();
    const TestComponent = () => (
      <>
        <CanUpdate
          {...{
            countRender: countRender1.count,
            subscribeId,
            testId: testId1,
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

    const { unmount, fireNode, getTextFromNode } = render(<TestComponent />);
    const map = getLastMap();
    expect(getTextFromNode(testId2)).toBe('');

    fireNode(testId1, 'cat');
    expect(getTextFromNode(testId2)).toBe('cat');
    expect(countRender1.howManyTimesBeenCalled()).toBe(1);
    expect(countRender2.howManyTimesBeenCalled()).toBe(2);
    if (shouldTestPerformance) {
      expect((map.get(subscribeId) as { setters: any[] }).setters.length).toBe(1);
    }

    unmount();
    if (shouldTestPerformance) {
      expect((map.get(subscribeId) as { setters: any[] }).setters.length).toBe(0);
    }
  },
];

export default siblingsCanCommunicate;
