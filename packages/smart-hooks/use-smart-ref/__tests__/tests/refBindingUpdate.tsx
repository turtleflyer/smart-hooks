import { render } from '@testing-library/react';
import React, { useRef } from 'react';
import type { FC } from 'react';
import type { TestDescription } from '../testsAssets';

const refBindingUpdate: TestDescription = (p) => [
  'ref binding and updating works',
  () => {
    const {
      assets: { executionCountersFactory, wrapWithStrictModeComponent, useSmartRef },
    } = p;
    let storeArg: string | undefined;
    const actionCounter = executionCountersFactory();
    const actionWork = (arg: string) => {
      actionCounter.count();
      storeArg = arg;
    };
    let storeArgAfterClean: string | undefined;
    const cleanCounter = executionCountersFactory();
    const cleanUpWork = (arg: string) => {
      cleanCounter.count();
      storeArgAfterClean = arg;
    };
    let dataKeyOfElement: string | undefined | null;
    let dataKeyFromRef: string | undefined | null;

    const TestComponent: FC<{
      scenario: 1 | 2 | 3;
      arg: string;
      writeRefs?: boolean;
    }> = wrapWithStrictModeComponent(({ scenario, arg, writeRefs = false }) => {
      const elementRef = useRef<HTMLDivElement | null>();

      const ref = useSmartRef((e) => {
        actionWork(arg);
        dataKeyOfElement = e && e.getAttribute('data-key');
        return () => {
          cleanUpWork(arg);
        };
      }, elementRef);

      if (writeRefs) {
        dataKeyFromRef = elementRef.current && elementRef.current.getAttribute('data-key');
      }

      return (
        <>
          {scenario === 1 ? (
            <div key="1" data-key="1" ref={ref} />
          ) : scenario === 2 ? (
            <div key="2" data-key="2" ref={ref} />
          ) : null}
        </>
      );
    });

    const { rerender, unmount } = render(<TestComponent scenario={1} arg="red" />);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeArg).toBe('red');
    expect(cleanCounter.howManyTimesBeenCalled()).toBe(0);
    expect(storeArgAfterClean).toBeUndefined();
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} arg="red" writeRefs />);
    expect(dataKeyFromRef).toBe('1');

    rerender(<TestComponent scenario={1} arg="yellow" />);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeArg).toBe('red');
    expect(cleanCounter.howManyTimesBeenCalled()).toBe(0);
    expect(storeArgAfterClean).toBeUndefined();
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} arg="yellow" writeRefs />);
    expect(dataKeyFromRef).toBe('1');

    rerender(<TestComponent scenario={2} arg="magenta" />);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(2);
    expect(storeArg).toBe('magenta');
    expect(cleanCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeArgAfterClean).toBe('red');
    expect(dataKeyOfElement).toBe('2');
    rerender(<TestComponent scenario={2} arg="magenta" writeRefs />);
    expect(dataKeyFromRef).toBe('2');

    rerender(<TestComponent scenario={1} arg="pink" />);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(3);
    expect(storeArg).toBe('pink');
    expect(cleanCounter.howManyTimesBeenCalled()).toBe(2);
    expect(storeArgAfterClean).toBe('magenta');
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} arg="pink" writeRefs />);
    expect(dataKeyFromRef).toBe('1');

    rerender(<TestComponent scenario={3} arg="brown" />);
    expect(actionCounter.howManyTimesBeenCalled()).toBe(3);
    expect(storeArg).toBe('pink');
    expect(cleanCounter.howManyTimesBeenCalled()).toBe(3);
    expect(storeArgAfterClean).toBe('pink');
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={3} arg="brown" writeRefs />);
    expect(dataKeyFromRef).toBe(null);

    unmount();
    expect(actionCounter.howManyTimesBeenCalled()).toBe(3);
    expect(storeArg).toBe('pink');
    expect(cleanCounter.howManyTimesBeenCalled()).toBe(3);
    expect(storeArgAfterClean).toBe('pink');
    expect(dataKeyOfElement).toBe('1');
  },
];

export default refBindingUpdate;
