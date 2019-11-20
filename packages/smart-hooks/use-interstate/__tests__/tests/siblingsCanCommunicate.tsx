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
      assets: { render, getLastMap },
    } = p;
    const { CanListen, CanUpdate } = createTestComponents(p);
    const subscribeId = '1';
    const testId1 = 'updater';
    const testId2 = 'listener';
    const countRender1 = jest.fn();
    const countRender2 = jest.fn();
    const TestComponent = () => (
      <>
        <CanUpdate
          {...{
            countRender: countRender1,
            subscribeId,
            testId: testId1,
          }}
        />
        <CanListen
          {...{
            countRender: countRender2,
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
    expect(countRender1).toHaveBeenCalledTimes(1);
    expect(countRender2).toHaveBeenCalledTimes(2);
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
