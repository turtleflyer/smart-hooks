import React, { useCallback, useEffect } from 'react';
import { Scope, useSetInterstate, useSubscribeInterstate } from '../useInterstate';
import { defaultComposeCallback } from './prerequisite';

const CanListen = ({
  subscribeId,
  initialValue,
  testId = '',
  countRender = () => null,
  children,
}: {
  subscribeId: string | number;
  initialValue?: number | string;
  testId?: string;
  countRender?: (...args: any[]) => any;
  children?: React.ReactChild | React.ReactChild[];
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

const CanUpdate = ({
  subscribeId,
  initialValue,
  testId = '',
  composeCallback = defaultComposeCallback,
  countRender = () => null,
  children,
}: {
  subscribeId: string | number;
  initialValue?: number | string;
  testId?: string;
  composeCallback?: (...args: any[]) => any;
  countRender?: (...args: any[]) => any;
  children?: React.ReactChild | React.ReactChild[];
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

const CanListenAndUpdate = ({
  subscribeId,
  initialValue,
  testId = '',
  composeCallback = defaultComposeCallback,
  countRender = () => null,
  children,
}: {
  subscribeId: string | number;
  initialValue?: number | string;
  testId?: string;
  composeCallback?: (...args: any[]) => any;
  countRender?: (...args: any[]) => any;
  children?: React.ReactChild | React.ReactChild[];
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

export { CanListen, CanUpdate, CanListenAndUpdate, Scope };
