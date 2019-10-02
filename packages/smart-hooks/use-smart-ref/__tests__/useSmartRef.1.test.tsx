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

  test('ref binding and updating works', () => {
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
              ? (<div key='1' data-key='1' ref={ref} />)
              : (<div key='2' data-key='2' ref={ref} />)
          }
        </>
      );
    };

    const { rerender, unmount } = render(<TestComponent scenario={1} fake='red' />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(1);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeFake).toBe('red');
    expect(cleanCounter.toHaveBeenCalledTimes).toBe(0);
    expect(storeFakeAfterClean).toBeUndefined();
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} fake='red' writeRefs={true} />);
    expect(dataKeyFromRef).toBe('1');

    rerender(<TestComponent scenario={1} fake='yellow' />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(3);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeFake).toBe('red');
    expect(cleanCounter.toHaveBeenCalledTimes).toBe(0);
    expect(storeFakeAfterClean).toBeUndefined();
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} fake='yellow' writeRefs={true} />);
    expect(dataKeyFromRef).toBe('1');

    rerender(<TestComponent scenario={2} fake='magenta' />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(5);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(2);
    expect(storeFake).toBe('magenta');
    expect(cleanCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeFakeAfterClean).toBe('red');
    expect(dataKeyOfElement).toBe('2');
    rerender(<TestComponent scenario={2} fake='magenta' writeRefs={true} />);
    expect(dataKeyFromRef).toBe('2');

    rerender(<TestComponent scenario={1} fake='pink' />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(7);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(3);
    expect(storeFake).toBe('pink');
    expect(cleanCounter.toHaveBeenCalledTimes).toBe(2);
    expect(storeFakeAfterClean).toBe('magenta');
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} fake='pink' writeRefs={true} />);
    expect(dataKeyFromRef).toBe('1');

    unmount();
    expect(mainCounter.toHaveBeenCalledTimes).toBe(8);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(3);
    expect(storeFake).toBe('pink');
    expect(cleanCounter.toHaveBeenCalledTimes).toBe(3);
    expect(storeFakeAfterClean).toBe('pink');
    expect(dataKeyOfElement).toBe('1');
  });

  test('cleaning after element unmount works', () => {
    const mainCounter = new Counter();
    const actionCounter = new Counter();
    let storeActionFake: string | undefined;
    const actionHandler = (fake: string) => {
      actionCounter.count();
      storeActionFake = fake;
    };
    const cleanerCounter = new Counter();
    let storeCleanerFake: string | undefined;
    const cleanerHandler = (fake: string) => {
      cleanerCounter.count();
      storeCleanerFake = fake;
    };
    let refElement: React.MutableRefObject<HTMLElement | undefined | null> | undefined;

    const TestComponent = ({ scenario, fake }: { scenario: 1 | 2; fake: string }) => {
      mainCounter.count();
      refElement = useRef<HTMLElement | null>();

      const ref = useSmartRef(() => {
        actionHandler(fake);
        return () => {
          cleanerHandler(fake);
        };
      }, refElement);

      return (
        <div> {scenario === 1 && (<div data-key='element' ref={ref}>test</div>)} </div>
      );
    };

    const { rerender, unmount } = render(<TestComponent scenario={1} fake='right' />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(1);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeActionFake).toBe('right');
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(0);
    expect(storeCleanerFake).toBe(undefined);
    expect(refElement
      && refElement.current
      && refElement.current.getAttribute('data-key')).toBe('element');

    rerender(<TestComponent scenario={2} fake='left' />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(2);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeActionFake).toBe('right');
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeCleanerFake).toBe('right');
    expect(refElement && refElement.current).toBeNull();

    rerender(<TestComponent scenario={1} fake='up' />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(3);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(2);
    expect(storeActionFake).toBe('up');
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeCleanerFake).toBe('right');

    unmount();
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(2);
    expect(storeCleanerFake).toBe('up');
  });
});
