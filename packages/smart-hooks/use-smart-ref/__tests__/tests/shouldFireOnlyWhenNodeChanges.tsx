import { render } from '@testing-library/react';
import React from 'react';
import type { TestDescription } from '../testsAssets';

const shouldFireOnlyWhenNodeChanges: TestDescription = (p) => [
  'make sure the effect runs only when node changes',
  () => {
    const {
      assets: { executionCountersFactory, wrapWithStrictModeComponent, useSmartRef },
    } = p;
    const actionCounter = executionCountersFactory();
    const cleanerCounter = executionCountersFactory();

    const TestComponent: React.FunctionComponent<{ scenario: 1 | 2 }> = wrapWithStrictModeComponent(
      ({ scenario }) => {
        const ref = useSmartRef<HTMLDivElement>(() => {
          actionCounter.count();
          return () => {
            cleanerCounter.count();
          };
        });

        return (
          <div>
            <div data-key="element" ref={ref} />
            {scenario === 1 && <div />}
          </div>
        );
      }
    );

    const { rerender, unmount } = render(<TestComponent scenario={1} />);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(1);
    expect(cleanerCounter.howManyTimesBeenCalled()).toBe(0);

    rerender(<TestComponent scenario={2} />);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(1);
    expect(cleanerCounter.howManyTimesBeenCalled()).toBe(0);

    rerender(<TestComponent scenario={1} />);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(1);
    expect(cleanerCounter.howManyTimesBeenCalled()).toBe(0);

    unmount();
    expect(actionCounter.howManyTimesBeenCalled()).toBe(1);
    expect(cleanerCounter.howManyTimesBeenCalled()).toBe(1);
  },
];

export default shouldFireOnlyWhenNodeChanges;
