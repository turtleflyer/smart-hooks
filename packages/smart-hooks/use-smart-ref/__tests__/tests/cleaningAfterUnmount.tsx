import { render } from '@testing-library/react';
import React, { useRef } from 'react';
import type { TestDescription } from '../testsAssets';

const cleaningAfterUnmount: TestDescription = (p) => [
  'cleaning after element unmount works',
  () => {
    const {
      assets: { executionCountersFactory, wrapWithStrictModeComponent, useSmartRef },
    } = p;
    const actionCounter = executionCountersFactory();
    let storeActionArg: string | undefined;
    const actionHandler = (arg: string) => {
      actionCounter.count();
      storeActionArg = arg;
    };
    const cleanerCounter = executionCountersFactory();
    let storeCleanerArg: string | undefined;
    const cleanerHandler = (arg: string) => {
      cleanerCounter.count();
      storeCleanerArg = arg;
    };
    let refElement!: React.MutableRefObject<HTMLDivElement | undefined | null>;

    const TestComponent: React.FunctionComponent<{
      scenario: 1 | 2;
      arg: string;
    }> = wrapWithStrictModeComponent(({ scenario, arg }) => {
      refElement = useRef<HTMLDivElement | null>();

      const ref = useSmartRef(() => {
        actionHandler(arg);
        return () => {
          cleanerHandler(arg);
        };
      }, refElement);

      return (
        <div>
          {scenario === 1 && (
            <div data-key="element" ref={ref}>
              test
            </div>
          )}
        </div>
      );
    });

    const { rerender, unmount } = render(<TestComponent scenario={1} arg="right" />);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeActionArg).toBe('right');
    expect(cleanerCounter.howManyTimesBeenCalled()).toBe(0);
    expect(storeCleanerArg).toBe(undefined);
    expect(refElement && refElement.current && refElement.current.getAttribute('data-key')).toBe(
      'element'
    );

    rerender(<TestComponent scenario={2} arg="left" />);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeActionArg).toBe('right');
    expect(cleanerCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeCleanerArg).toBe('right');
    expect(refElement && refElement.current).toBeNull();

    rerender(<TestComponent scenario={1} arg="up" />);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(2);
    expect(storeActionArg).toBe('up');
    expect(cleanerCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeCleanerArg).toBe('right');

    unmount();
    expect(cleanerCounter.howManyTimesBeenCalled()).toBe(2);
    expect(storeCleanerArg).toBe('up');
  },
];

export default cleaningAfterUnmount;
