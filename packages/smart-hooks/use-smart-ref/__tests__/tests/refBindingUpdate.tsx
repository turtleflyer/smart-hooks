import { render } from '@testing-library/react';
import React, { useRef } from 'react';
import { TestDescription } from '../testsAssets';

const refBindingUpdate: TestDescription = p => [
  'ref binding and updating works',
  () => {
    const {
      assets: { executionCountersFactory, useSmartRef },
    } = p;
    const mainCounter = executionCountersFactory();
    let storeFake: string | undefined;
    const actionCounter = executionCountersFactory();
    const actionWork = (fake: string) => {
      actionCounter.count();
      storeFake = fake;
    };
    let storeFakeAfterClean: string | undefined;
    const cleanCounter = executionCountersFactory();
    const cleanUpWork = (fake: string) => {
      cleanCounter.count();
      storeFakeAfterClean = fake;
    };
    let dataKeyOfElement: string | undefined | null;
    let dataKeyFromRef: string | undefined | null;

    const TestComponent = ({
      scenario,
      fake,
      writeRefs = false,
    }: {
      scenario: 1 | 2;
      fake: string;
      writeRefs?: boolean;
    }) => {
      mainCounter.count();

      const elementRef = useRef<HTMLDivElement | null>();

      const ref = useSmartRef(e => {
        actionWork(fake);
        dataKeyOfElement = e && e.getAttribute('data-key');
        return () => {
          cleanUpWork(fake);
        };
      }, elementRef);

      if (writeRefs) {
        dataKeyFromRef = elementRef.current && elementRef.current.getAttribute('data-key');
      }

      return (
        <>
          {scenario === 1 ? (
            <div key="1" data-key="1" ref={ref} />
          ) : (
            <div key="2" data-key="2" ref={ref} />
          )}
        </>
      );
    };

    const { rerender, unmount } = render(<TestComponent scenario={1} fake="red" />);
    expect(mainCounter.howManyTimesBeenCalled()).toBe(1);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeFake).toBe('red');
    expect(cleanCounter.howManyTimesBeenCalled()).toBe(0);
    expect(storeFakeAfterClean).toBeUndefined();
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} fake="red" writeRefs={true} />);
    expect(dataKeyFromRef).toBe('1');

    rerender(<TestComponent scenario={1} fake="yellow" />);
    expect(mainCounter.howManyTimesBeenCalled()).toBe(3);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeFake).toBe('red');
    expect(cleanCounter.howManyTimesBeenCalled()).toBe(0);
    expect(storeFakeAfterClean).toBeUndefined();
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} fake="yellow" writeRefs={true} />);
    expect(dataKeyFromRef).toBe('1');

    rerender(<TestComponent scenario={2} fake="magenta" />);
    expect(mainCounter.howManyTimesBeenCalled()).toBe(5);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(2);
    expect(storeFake).toBe('magenta');
    expect(cleanCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeFakeAfterClean).toBe('red');
    expect(dataKeyOfElement).toBe('2');
    rerender(<TestComponent scenario={2} fake="magenta" writeRefs={true} />);
    expect(dataKeyFromRef).toBe('2');

    rerender(<TestComponent scenario={1} fake="pink" />);
    expect(mainCounter.howManyTimesBeenCalled()).toBe(7);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(3);
    expect(storeFake).toBe('pink');
    expect(cleanCounter.howManyTimesBeenCalled()).toBe(2);
    expect(storeFakeAfterClean).toBe('magenta');
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} fake="pink" writeRefs={true} />);
    expect(dataKeyFromRef).toBe('1');

    unmount();
    expect(mainCounter.howManyTimesBeenCalled()).toBe(8);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(3);
    expect(storeFake).toBe('pink');
    expect(cleanCounter.howManyTimesBeenCalled()).toBe(3);
    expect(storeFakeAfterClean).toBe('pink');
    expect(dataKeyOfElement).toBe('1');
  },
];

export default refBindingUpdate;
