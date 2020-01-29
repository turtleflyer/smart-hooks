import { render } from '@testing-library/react';
import React, { useRef } from 'react';
import { TestDescription } from '../testsAssets';

const cleaningAfterUnmount: TestDescription = p => [
  'cleaning after element unmount works',
  () => {
    const {
      assets: { executionCountersFactory, useSmartRef },
    } = p;
    const mainCounter = executionCountersFactory();
    const actionCounter = executionCountersFactory();
    let storeActionFake: string | undefined;
    const actionHandler = (fake: string) => {
      actionCounter.count();
      storeActionFake = fake;
    };
    const cleanerCounter = executionCountersFactory();
    let storeCleanerFake: string | undefined;
    const cleanerHandler = (fake: string) => {
      cleanerCounter.count();
      storeCleanerFake = fake;
    };
    let refElement:
      | React.MutableRefObject<HTMLDivElement | undefined | null>
      | undefined;

    const TestComponent = ({
      scenario,
      fake,
    }: {
      scenario: 1 | 2;
      fake: string;
    }) => {
      mainCounter.count();
      refElement = useRef<HTMLDivElement | null>();

      const ref = useSmartRef<HTMLDivElement>(() => {
        actionHandler(fake);
        return () => {
          cleanerHandler(fake);
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
    };

    const { rerender, unmount } = render(
      <TestComponent scenario={1} fake="right" />,
    );
    expect(mainCounter.howManyTimesBeenCalled()).toBe(1);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeActionFake).toBe('right');
    expect(cleanerCounter.howManyTimesBeenCalled()).toBe(0);
    expect(storeCleanerFake).toBe(undefined);
    expect(
      refElement &&
        refElement.current &&
        refElement.current.getAttribute('data-key'),
    ).toBe('element');

    rerender(<TestComponent scenario={2} fake="left" />);
    expect(mainCounter.howManyTimesBeenCalled()).toBe(2);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeActionFake).toBe('right');
    expect(cleanerCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeCleanerFake).toBe('right');
    expect(refElement && refElement.current).toBeNull();

    rerender(<TestComponent scenario={1} fake="up" />);
    expect(mainCounter.howManyTimesBeenCalled()).toBe(3);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(2);
    expect(storeActionFake).toBe('up');
    expect(cleanerCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeCleanerFake).toBe('right');

    unmount();
    expect(cleanerCounter.howManyTimesBeenCalled()).toBe(2);
    expect(storeCleanerFake).toBe('up');
  },
];

export default cleaningAfterUnmount;
