/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */
import { render } from '@testing-library/react';
import React, { useRef } from 'react';
import { useSmartRef as useSmartRefT } from '../useSmartRef';
import { Counter as CounterT } from './prerequisite';

describe('Test useSmartRef functionality', () => {
  let useSmartRef: typeof useSmartRefT;
  let Counter: typeof CounterT;

  beforeEach(() => {
    jest.isolateModules(() => {
      ({ useSmartRef } = require('../useSmartRef.ts'));
      ({ Counter } = require('./prerequisite.ts'));
    });
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
        <div> {scenario === 1 && (<div data-key="element" ref={ref}>test</div>)} </div>
      );
    };

    const { rerender, unmount } = render(<TestComponent scenario={1} fake="right" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(1);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeActionFake).toBe('right');
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(0);
    expect(storeCleanerFake).toBe(undefined);
    expect(refElement
      && refElement.current
      && refElement.current.getAttribute('data-key')).toBe('element');

    rerender(<TestComponent scenario={2} fake="left" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(2);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeActionFake).toBe('right');
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeCleanerFake).toBe('right');
    expect(refElement && refElement.current).toBeNull();

    rerender(<TestComponent scenario={1} fake="up" />);
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
