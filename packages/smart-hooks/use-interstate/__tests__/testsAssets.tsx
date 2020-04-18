// tslint:disable: react-hooks-nesting
// tslint:disable-next-line: no-implicit-dependencies
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import * as mockedStoryFactory from '../storeFactory';
import {
  Scope,
  useInterstate,
  InterstateInitializeParam,
} from '../useInterstate';
import React, { useEffect, useMemo } from 'react';
import { executionCountersFactory } from '../../../../test_utilities/executionCounter';

jest.mock('../storeFactory.ts');

const { getLastMap } = mockedStoryFactory as typeof mockedStoryFactory & {
  getLastMap: () => Map<any, any>;
};

type ArgsType<T> = T extends (...args: infer R) => any ? R : any;
type FirstArrayMember<T> = T extends [infer R, ...any[]] ? R : any;

function newRender(arg: FirstArrayMember<ArgsType<typeof render>>) {
  const fromRender = render(arg);
  const { getByTestId } = fromRender;

  const fireNode = (testId: string, value: string) => {
    const element = getByTestId(testId);
    if (element) {
      const inputChild = element.querySelector(
        `[data-testid=${testId}] > input`
      );
      if (inputChild) {
        fireEvent.change(inputChild, {
          target: { value },
        });
      }
    }
  };

  const getTextFromNode = (testId: string) => {
    const element = getByTestId(testId);
    return element &&
      element.firstChild &&
      element.firstChild.nodeName === '#text'
      ? element.firstChild.textContent
      : '';
  };

  return { ...fromRender, fireNode, getTextFromNode };
}

type FieldsValue = string;
type InitType = InterstateInitializeParam<FieldsValue>;
type InterstateID = string | number;

type ComposeCallback = (
  set: (v: InterstateInitializeParam<FieldsValue>) => void
) => ({ target: { value } }: { target: { value: string } }) => void;

interface TestComponentsProps {
  subscribeId: InterstateID;
  initialValue?: InitType;
  testId?: string;
  composeCallback?: (...args: any[]) => any;
  countRender?: () => void;
  children?: React.ReactChild | React.ReactChild[];
}

const defaultComposeCallback: ComposeCallback = set => ({
  target: { value },
}) => {
  set(value);
};

const CanListen: React.FunctionComponent<TestComponentsProps> = ({
  subscribeId,
  initialValue,
  testId = '',
  countRender = () => {},
  children,
}) => {
  const [useSubscribe] = useInterstate(subscribeId, initialValue);
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

const CanUpdate: React.FunctionComponent<TestComponentsProps> = ({
  subscribeId,
  initialValue,
  testId = '',
  composeCallback = defaultComposeCallback,
  countRender = () => {},
  children,
}) => {
  const [, setState] = useInterstate(subscribeId, initialValue);
  const callback = useMemo(() => composeCallback(setState), [
    composeCallback,
    setState,
  ]);
  useEffect(() => {
    countRender();
  });

  return (
    <div data-testid={testId}>
      <input value="" onChange={callback} />
      {children ? <div>{children}</div> : null}
    </div>
  );
};

const CanListenAndUpdate: React.FunctionComponent<TestComponentsProps> = ({
  subscribeId,
  initialValue,
  testId = '',
  composeCallback = defaultComposeCallback,
  countRender = () => {},
  children,
}) => {
  const [useSubscribe, setState] = useInterstate(subscribeId, initialValue);
  const state = useSubscribe();
  const callback = useMemo(() => composeCallback(setState), [
    composeCallback,
    setState,
  ]);
  useEffect(() => {
    countRender();
  });

  return (
    <div data-testid={testId}>
      {state}
      <input value="" onChange={callback} />
      <div>{children}</div>
    </div>
  );
};

interface UseInterstateImport {
  Scope: typeof Scope;
  useInterstate: typeof useInterstate;
}

interface AssetsImport {
  render: typeof newRender;
  getLastMap: typeof getLastMap;
  fireEvent: typeof fireEvent;
  executionCountersFactory: typeof executionCountersFactory;
  CanListen: React.FunctionComponent<TestComponentsProps>;
  CanUpdate: React.FunctionComponent<TestComponentsProps>;
  CanListenAndUpdate: React.FunctionComponent<TestComponentsProps>;
}

interface TestParameter {
  assets: AssetsImport & UseInterstateImport;
}

type TestDescription = (p: TestParameter) => [string, () => void];

export {
  newRender as render,
  getLastMap,
  fireEvent,
  executionCountersFactory,
  FieldsValue,
  InterstateID,
  CanListen,
  CanUpdate,
  CanListenAndUpdate,
  TestParameter,
  TestDescription,
  ComposeCallback,
  AssetsImport,
  UseInterstateImport,
};
