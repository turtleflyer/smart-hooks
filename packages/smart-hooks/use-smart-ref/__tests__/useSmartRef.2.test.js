/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */
import React from 'react';
import { PropTypes } from 'prop-types';
import { render } from '@testing-library/react';

describe('Test useSmartRef functionality', () => {
  let useSmartRef;
  let Counter;

  beforeEach(() => {
    jest.isolateModules(() => {
      ({ default: useSmartRef } = require('../useSmartRef'));
      ({ Counter } = require('./prerequisite'));
    });
  });

  test('', async () => {
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

    const TestComponent = ({ scenario, fake }) => {
      mainCounter.count();

      const ref = useSmartRef(() => {
        actionHandler(fake);
        return () => {
          cleanerHandler(fake);
        };
      });

      return <div>{scenario === 1 && <div ref={ref}>test</div>}</div>;
    };

    TestComponent.propTypes = {
      scenario: PropTypes.oneOf([1, 2]).isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      fake: PropTypes.any,
    };

    TestComponent.defaultProps = {
      fake: undefined,
    };

    const { rerender, unmount } = await render(<TestComponent scenario={1} fake="right" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(1);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeActionFake).toBe('right');
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(0);
    expect(storeCleanerFake).toBe(undefined);

    await rerender(<TestComponent scenario={2} fake="left" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(2);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeActionFake).toBe('right');
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeCleanerFake).toBe('right');
    unmount();
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeCleanerFake).toBe('right');
  });
});
