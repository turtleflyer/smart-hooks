/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */

// import React from 'react';

import {
  React, render, fireEvent, getLastMaps, CanListen, CanUpdate,
} from './prerequisite ';

describe('Test useInterstate functionality', () => {
  test('siblings can communicate', () => {
    const subscribeId = '1';
    const testId1 = 'updater';
    const testId2 = 'listener';
    const composeCallback = set => ({ target: { value } }) => {
      set(value);
    };
    const countRender1 = jest.fn();
    const countRender2 = jest.fn();
    const TestComponent = () => (
      <>
        <CanUpdate
          {...{
            subscribeId,
            composeCallback,
            testId: testId1,
            countRender: countRender1,
          }}
        />
        <CanListen
          {...{
            subscribeId,
            testId: testId2,
            countRender: countRender2,
          }}
        />
      </>
    );
    const { unmount, getByTestId } = render(<TestComponent />);
    const maps = getLastMaps();
    expect(getByTestId(testId2)).toHaveTextContent('');
    fireEvent.change(getByTestId(testId1), { target: { value: 'n' } });
    expect(getByTestId(testId2)).toHaveTextContent('n');
    expect(countRender1).toHaveBeenCalledTimes(1);
    expect(countRender2).toHaveBeenCalledTimes(2);
    expect(maps.map.get(subscribeId).setters.length).toBe(1);
    unmount();
  });
});
