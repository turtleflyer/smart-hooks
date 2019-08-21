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
  subscribeId, initialValue, testId, countRender, children,
}) => {
  const [, useSubscribe] = useInterstate(subscribeId, initialValue);
  const state = useSubscribe();
  countRender();

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
  countRender();

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
  composeCallback: PropTypes.func.isRequired,
  countRender: PropTypes.func,
  children: PropTypes.node,
};

CanUpdate.defaultProps = {
  initialValue: undefined,
  testId: '',
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
  countRender();

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
  composeCallback: PropTypes.func.isRequired,
  countRender: PropTypes.func,
  children: PropTypes.node,
};

CanListenAndUpdate.defaultProps = {
  initialValue: undefined,
  testId: '',
  countRender: () => null,
  children: null,
};

export {
  React, render, fireEvent, getLastMaps, CanListen, CanUpdate, CanListenAndUpdate,
};
