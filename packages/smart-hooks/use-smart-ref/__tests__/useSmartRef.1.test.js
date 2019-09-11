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

  test('ref binding and update work', () => {
    const mainCounter = new Counter();
    let storeFake;
    const actionCounter = new Counter();
    const actionWork = (fake) => {
      actionCounter.count();
      storeFake = fake;
    };
    let storeFakeAfterClean;
    const cleanCounter = new Counter();
    const cleanUpWork = (fake) => {
      cleanCounter.count();
      storeFakeAfterClean = fake;
    };
    let dataKeyOfElement;
    let dataKeyFromRef;

    const TestComponent = ({ scenario, fake, writeRefs }) => {
      mainCounter.count();

      const elementRef = useRef();

      const ref = useSmartRef((e) => {
        actionWork(fake);
        dataKeyOfElement = e.getAttribute('data-key');
        return () => {
          cleanUpWork(fake);
        };
      }, elementRef);

      if (writeRefs) {
        dataKeyFromRef = elementRef.current.getAttribute('data-key');
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

    TestComponent.propTypes = {
      scenario: PropTypes.oneOf([1, 2]).isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      fake: PropTypes.any,
      writeRefs: PropTypes.bool,
    };

    TestComponent.defaultProps = {
      fake: undefined,
      writeRefs: false,
    };

    const { rerender, unmount } = render(<TestComponent scenario={1} fake="red" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(1);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeFake).toBe('red');
    expect(cleanCounter.toHaveBeenCalledTimes).toBe(0);
    expect(storeFakeAfterClean).toBeUndefined();
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} fake="red" writeRefs />);
    expect(dataKeyFromRef).toBe('1');

    rerender(<TestComponent scenario={1} fake="yellow" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(3);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeFake).toBe('red');
    expect(cleanCounter.toHaveBeenCalledTimes).toBe(0);
    expect(storeFakeAfterClean).toBeUndefined();
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} fake="yellow" writeRefs />);
    expect(dataKeyFromRef).toBe('1');

    rerender(<TestComponent scenario={2} fake="magenta" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(5);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(2);
    expect(storeFake).toBe('magenta');
    expect(cleanCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeFakeAfterClean).toBe('red');
    expect(dataKeyOfElement).toBe('2');
    rerender(<TestComponent scenario={2} fake="magenta" writeRefs />);
    expect(dataKeyFromRef).toBe('2');

    rerender(<TestComponent scenario={1} fake="pink" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(7);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(3);
    expect(storeFake).toBe('pink');
    expect(cleanCounter.toHaveBeenCalledTimes).toBe(2);
    expect(storeFakeAfterClean).toBe('magenta');
    expect(dataKeyOfElement).toBe('1');
    rerender(<TestComponent scenario={1} fake="pink" writeRefs />);
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
