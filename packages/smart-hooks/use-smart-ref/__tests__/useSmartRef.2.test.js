/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */
import React, { useRef } from 'react';
import { PropTypes } from 'prop-types';
import { render } from '@testing-library/react';

describe('Test useSmartRef functionality', () => {
  let useSmartRef;
  let Counter;

  beforeEach(() => {
    jest.isolateModules(() => {
      ({ useSmartRef } = require('../useSmartRef'));
      ({ Counter } = require('./prerequisite'));
    });
  });

  test('cleaning after element unmount works', () => {
    const mainCounter = new Counter();
    const actionCounter = new Counter();
    let storeActionFake;
    const actionHandler = (fake) => {
      actionCounter.count();
      storeActionFake = fake;
    };
    const cleanerCounter = new Counter();
    let storeCleanerFake;
    const cleanerHandler = (fake) => {
      cleanerCounter.count();
      storeCleanerFake = fake;
    };
    let refElement;

    const TestComponent = ({ scenario, fake }) => {
      mainCounter.count();
      refElement = useRef();

      const ref = useSmartRef(() => {
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

    TestComponent.propTypes = {
      scenario: PropTypes.oneOf([1, 2]).isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      fake: PropTypes.any,
    };

    TestComponent.defaultProps = {
      fake: undefined,
    };

    const { rerender, unmount } = render(<TestComponent scenario={1} fake="right" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(1);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeActionFake).toBe('right');
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(0);
    expect(storeCleanerFake).toBe(undefined);
    expect(refElement.current.getAttribute('data-key')).toBe('element');

    rerender(<TestComponent scenario={2} fake="left" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(2);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeActionFake).toBe('right');
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeCleanerFake).toBe('right');
    expect(refElement.current).toBeNull();

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
    let recordRefs;
    const checkRecordRefs = rec => rec.map(ref => ref.current.getAttribute('data-key'));

    const TestComponent = ({ scenario }) => {
      recordRefs = [useRef(), useRef()];

      const usedRefElement = scenario === 1 ? recordRefs[0] : recordRefs[1];

      const ref = useSmartRef(() => {}, usedRefElement);

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

    TestComponent.propTypes = {
      scenario: PropTypes.oneOf([1, 2]).isRequired,
    };

    const { rerender, unmount } = render(<TestComponent scenario={1} />);
    expect(checkRecordRefs(recordRefs)).toEqual(['1', '2']);

    rerender(<TestComponent scenario={2} />);
    expect(checkRecordRefs(recordRefs)).toEqual(['2', '1']);

    unmount();
  });
});
