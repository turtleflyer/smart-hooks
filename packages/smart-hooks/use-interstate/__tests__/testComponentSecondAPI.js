/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */

import React, { useCallback, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { useSubscribeInterstate, useSetInterstate, ProvideScope } from '../useInterstate';

const defComposeCallback = set => ({ target: { value } }) => {
  set(value);
};

const CanListen = ({
  subscribeId, initialValue, testId, countRender, children,
}) => {
  const state = useSubscribeInterstate(subscribeId, initialValue);
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
  const setState = useSetInterstate(subscribeId, initialValue);
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
  const setState = useSetInterstate(subscribeId, initialValue);
  const state = useSubscribeInterstate(subscribeId);
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

export {
  CanListen, CanUpdate, CanListenAndUpdate, ProvideScope,
};
