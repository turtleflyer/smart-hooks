/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */

import React, { useCallback, useEffect } from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PropTypes } from 'prop-types';
import useInterstate from '../useInterstate';
// eslint-disable-next-line import/named
import { getLastMaps } from '../../../../src/utils/getStore';

jest.mock('../../../../src/utils/getStore.js');

const defComposeCallback = set => ({ target: { value } }) => {
  set(value);
};

const CanListen = ({
  subscribeId, initialValue, testId, countRender, children,
}) => {
  const [, useSubscribe] = useInterstate(subscribeId, initialValue);
  const state = useSubscribe();
  useEffect(() => {
    countRender();
  });

  return (
    <div data-testid={testId}>
      {state}
      {children}
    </div>
  );
};

CanListen.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  subscribeId: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  initialValue: PropTypes.any,
  testId: PropTypes.string,
  countRender: PropTypes.func,
  children: PropTypes.node,
};

CanListen.defaultProps = {
  initialValue: undefined,
  testId: '',
  countRender: () => null,
  children: null,
};

const CanUpdate = ({
  subscribeId,
  initialValue,
  testId,
  composeCallback,
  countRender,
  children,
}) => {
  const [setState] = useInterstate(subscribeId, initialValue);
  const callback = useCallback(composeCallback(setState), [composeCallback, setState]);
  useEffect(() => {
    countRender();
  });

  return (
    <>
      <input data-testid={testId} value="" onChange={callback} />
      {children ? <div>{children}</div> : null}
    </>
  );
};

CanUpdate.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  subscribeId: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  initialValue: PropTypes.any,
  testId: PropTypes.string,
  composeCallback: PropTypes.func,
  countRender: PropTypes.func,
  children: PropTypes.node,
};

CanUpdate.defaultProps = {
  initialValue: undefined,
  testId: '',
  composeCallback: defComposeCallback,
  countRender: () => null,
  children: null,
};

const CanListenAndUpdate = ({
  subscribeId,
  initialValue,
  testId,
  composeCallback,
  countRender,
  children,
}) => {
  const [setState, useSubscribe] = useInterstate(subscribeId, initialValue);
  const state = useSubscribe();
  const callback = useCallback(composeCallback(setState), [composeCallback, setState]);
  useEffect(() => {
    countRender();
  });

  return (
    <div data-testid={testId}>
      <input value="" onChange={callback} />
      <div>
        {state}
        {children}
      </div>
    </div>
  );
};

CanListenAndUpdate.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  subscribeId: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  initialValue: PropTypes.any,
  testId: PropTypes.string,
  composeCallback: PropTypes.func,
  countRender: PropTypes.func,
  children: PropTypes.node,
};

CanListenAndUpdate.defaultProps = {
  initialValue: undefined,
  testId: '',
  composeCallback: defComposeCallback,
  countRender: () => null,
  children: null,
};

const newRender = (...arg) => {
  const fromRender = render(...arg);
  const { getByTestId } = fromRender;

  const fireNode = (testId, value) => {
    const element = getByTestId(testId);
    fireEvent.change(element.nodeName === 'INPUT' ? element : element.querySelector('input'), {
      target: { value },
    });
  };

  const getNodeWithText = (testId) => {
    const element = getByTestId(testId);
    return !element.firstChild || element.firstChild.nodeName === '#text'
      ? element
      : element.querySelector('div');
  };

  return { ...fromRender, fireNode, getNodeWithText };
};

export {
  React,
  newRender as render,
  fireEvent,
  getLastMaps,
  CanListen,
  CanUpdate,
  CanListenAndUpdate,
};
