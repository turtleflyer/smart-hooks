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

  test('dynamically changing ref works', () => {
    let recordRefs:
      Array<React.RefObject<HTMLDivElement>> | undefined;
    const checkRecordRefs = (rec?: Array<React.RefObject<HTMLElement>>) =>
      rec && rec.map((ref) => ref.current && ref.current.getAttribute('data-key'));

    const TestComponent = ({ scenario }: { scenario: 1 | 2 }) => {
      recordRefs = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
      ];

      const currentRef = scenario === 1 ? recordRefs[0] : recordRefs[1];

      // tslint:disable-next-line: no-empty
      const ref = useSmartRef(() => { }, currentRef);

      return (
        <>
          <div data-key="1" ref={ref}>
            test
            </div>
          <div data-key="2" ref={scenario === 1 ? recordRefs[1] : recordRefs[0]}>
            test
            </div>
        </>
      );
    };

    const { rerender, unmount } = render(<TestComponent scenario={1} />);
    expect(checkRecordRefs(recordRefs)).toEqual(['1', '2']);

    rerender(<TestComponent scenario={2} />);
    expect(checkRecordRefs(recordRefs)).toEqual(['2', '1']);

    unmount();
  });
});
