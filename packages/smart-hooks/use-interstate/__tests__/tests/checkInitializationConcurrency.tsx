import React from 'react';
import { TestDescription } from '../testsAssets';

const checkInitializationConcurrency: TestDescription = (p, createTestComponents) => [
  'check initialization concurrency',
  () => {
    const {
      assets: { render },
    } = p;
    const { CanListen, CanUpdate, CanListenAndUpdate } = createTestComponents(p);
    const subscribeId = '1';
    const testId = 'first';

    const InnerComponent = () => (
      <div>
        <CanListen
          {...{
            subscribeId,
            initialValue: 'b',
          }}
        />
      </div>
    );

    const TestComponent = () => (
      <>
        <div>
          <div>
            <CanUpdate
              {...{
                subscribeId,
                initialValue: 'a',
              }}
            />
            <InnerComponent />
          </div>
        </div>
        <CanListenAndUpdate
          {...{
            subscribeId,
            testId,
            initialValue: 'c',
          }}
        />
      </>
    );

    const { unmount, getTextFromNode } = render(<TestComponent />);
    expect(getTextFromNode(testId)).toBe('c');

    unmount();
  },
];

export default checkInitializationConcurrency;
