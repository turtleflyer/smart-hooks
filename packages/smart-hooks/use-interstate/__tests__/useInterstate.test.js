/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */

import React, { useCallback } from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PropTypes } from 'prop-types';
import useInterstate from '../useInterstate';

describe('Test useInterstate functionality', () => {
  const CanListen = ({
    subscribeId, initialValue, testId, countRender,
  }) => {
    const [, useSubscribe] = useInterstate(subscribeId, initialValue);
    const state = useSubscribe();
    countRender();

    return <div data-testid={testId}>{state}</div>;
  };

  CanListen.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    subscribeId: PropTypes.any.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    initialValue: PropTypes.any,
    testId: PropTypes.string,
    countRender: PropTypes.func,
  };

  CanListen.defaultProps = {
    initialValue: undefined,
    testId: '',
    countRender: () => null,
  };

  const CanUpdate = ({
    subscribeId, initialValue, testId, composeCallback, countRender,
  }) => {
    const [setState] = useInterstate(subscribeId, initialValue);
    const callback = useCallback(composeCallback(setState), [composeCallback, setState]);
    countRender();

    return <input data-testid={testId} value="" onChange={callback} />;
  };

  CanUpdate.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    subscribeId: PropTypes.any.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    initialValue: PropTypes.any,
    testId: PropTypes.string,
    composeCallback: PropTypes.func.isRequired,
    countRender: PropTypes.func,
  };

  CanUpdate.defaultProps = {
    initialValue: undefined,
    testId: '',
    countRender: () => null,
  };

  const CanListenAndUpdate = ({
    subscribeId,
    initialValue,
    testId,
    composeCallback,
    countRender,
  }) => {
    const [setState, useSubscribe] = useInterstate(subscribeId, initialValue);
    const state = useSubscribe();
    const callback = useCallback(composeCallback(setState), [composeCallback, setState]);
    countRender();

    return (
      <div data-testid={testId}>
        <div>{state}</div>
        <input value="" onChange={callback} />
      </div>
    );
  };

  CanListenAndUpdate.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    subscribeId: PropTypes.any.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    initialValue: PropTypes.any,
    testId: PropTypes.string,
    composeCallback: PropTypes.func.isRequired,
    countRender: PropTypes.func,
  };

  CanListenAndUpdate.defaultProps = {
    initialValue: undefined,
    testId: '',
    countRender: () => null,
  };

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
    expect(getByTestId(testId2)).toHaveTextContent('');
    fireEvent.change(getByTestId(testId1), { target: { value: 'n' } });
    expect(getByTestId(testId2)).toHaveTextContent('n');
    expect(countRender1).toHaveBeenCalledTimes(1);
    expect(countRender2).toHaveBeenCalledTimes(2);
    unmount();
  });
});
