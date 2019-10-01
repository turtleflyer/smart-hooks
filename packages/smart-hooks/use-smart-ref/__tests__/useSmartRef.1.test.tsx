import { render } from '@testing-library/react';
import React, { useRef } from 'react';
import { useSmartRef as useSmartRefT } from '../useSmartRef';
import { Counter as CounterT } from './prerequisite';

describe('Test useSmartRef functionality', () => {
  let useSmartRef: typeof useSmartRefT;
  let Counter: typeof CounterT;

  beforeEach(() => {
    jest.isolateModules(() => {
      ({ useSmartRef } = require('../useSmartRef'));
      ({ Counter } = require('./prerequisite'));
    });
  });

  test('ref binding and update works', () => {
    const mainCounter = new Counter();
    let storeFake: string | undefined;
    const actionCounter = new Counter();
    const actionWork = (fake: string) => {
      actionCounter.count();
      storeFake = fake;
    };
    let storeFakeAfterClean: string | undefined;
    const cleanCounter = new Counter();
    const cleanUpWork = (fake: string) => {
      cleanCounter.count();
      storeFakeAfterClean = fake;
    };
    let dataKeyOfElement: string | undefined | null;
    let dataKeyFromRef: string | undefined | null;

    const TestComponent = ({ scenario, fake, writeRefs = false }
      : { scenario: 1 | 2, fake: string, writeRefs?: boolean }) => {
      mainCounter.count();

      const elementRef = useRef<HTMLDivElement | null>();

      const ref = useSmartRef((e) => {
        actionWork(fake);
        dataKeyOfElement = e && e.getAttribute('data-key');
        return () => {
          cleanUpWork(fake);
        };
      }, elementRef);

      if (writeRefs) {
        dataKeyFromRef = elementRef.current
          && elementRef.current.getAttribute('data-key');
      }

      return (
        <>
          {
            scenario === 1
              ? (<div key="1" data-key="1" ref={ref} />)
              : (<div key="2" data-key="2" ref={ref} />)
          }
        </>
      );
    };

    const { rerender, unmount } = render(<TestComponent scenario={1} fake="red" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(1);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeFake).toBe('red');
    expect(cleanCounter.toHaveBeenCalledTimes).toBe(0);
    expect(storeFakeAfterClean).toBeUndefined();
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} fake="red" writeRefs={true} />);
    expect(dataKeyFromRef).toBe('1');

    rerender(<TestComponent scenario={1} fake="yellow" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(3);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeFake).toBe('red');
    expect(cleanCounter.toHaveBeenCalledTimes).toBe(0);
    expect(storeFakeAfterClean).toBeUndefined();
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} fake="yellow" writeRefs={true} />);
    expect(dataKeyFromRef).toBe('1');

    rerender(<TestComponent scenario={2} fake="magenta" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(5);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(2);
    expect(storeFake).toBe('magenta');
    expect(cleanCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeFakeAfterClean).toBe('red');
    expect(dataKeyOfElement).toBe('2');
    rerender(<TestComponent scenario={2} fake="magenta" writeRefs={true} />);
    expect(dataKeyFromRef).toBe('2');

    rerender(<TestComponent scenario={1} fake="pink" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(7);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(3);
    expect(storeFake).toBe('pink');
    expect(cleanCounter.toHaveBeenCalledTimes).toBe(2);
    expect(storeFakeAfterClean).toBe('magenta');
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} fake="pink" writeRefs={true} />);
    expect(dataKeyFromRef).toBe('1');

    unmount();
    expect(mainCounter.toHaveBeenCalledTimes).toBe(8);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(3);
    expect(storeFake).toBe('pink');
    expect(cleanCounter.toHaveBeenCalledTimes).toBe(3);
    expect(storeFakeAfterClean).toBe('pink');
    expect(dataKeyOfElement).toBe('1');
  });
});
