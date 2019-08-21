/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */

import React, { useCallback } from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PropTypes } from 'prop-types';
import useInterstate from '../useInterstate';
// eslint-disable-next-line import/named
import { getLastMaps } from '../../../../src/utils/getStore';

jest.mock('../../../../src/utils/getStore.js');

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

export {
  React,
  render,
  fireEvent,
  getLastMaps,
  CanListen,
  CanUpdate,
  CanListenAndUpdate,
};
