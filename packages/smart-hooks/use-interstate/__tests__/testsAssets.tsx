// tslint:disable: react-hooks-nesting
// tslint:disable-next-line: no-implicit-dependencies
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import * as mockedStoryFactory from '../storeFactory';
import {
  Scope,
  SetInterstate,
  useInterstate,
  useSubscribeInterstate,
  useSetInterstate,
} from '../useInterstate';
import React, { useCallback, useEffect } from 'react';
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
        `[data-testid=${testId}] > input`,
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
type InterstateID = string | number;

type ComposeCallback = (
  set: SetInterstate<FieldsValue>,
) => ({ target: { value } }: { target: { value: string } }) => void;
interface TestComponentsProps {
  subscribeId: InterstateID;
  initialValue?: FieldsValue;
  testId?: string;
  composeCallback?: (...args: any[]) => any;
  countRender?: () => void;
  children?: React.ReactChild | React.ReactChild[];
}
type UseAPItoListen = (
  subscribeId: InterstateID,
  initialValue?: FieldsValue,
) => FieldsValue;
type UseAPItoUpdate = (
  subscribeId: InterstateID,
  initialValue?: FieldsValue,
) => (p: FieldsValue) => void;
type UseAPItoListenAndUpdate = (
  subscribeId: InterstateID,
  initialValue?: FieldsValue,
) => [FieldsValue, (p: FieldsValue) => void];
type ComponentDependsOnAPI<
  T extends UseAPItoListen | UseAPItoUpdate | UseAPItoListenAndUpdate
> = (useAPI: T) => React.FunctionComponent<TestComponentsProps>;

const defaultComposeCallback: ComposeCallback = set => ({
  target: { value },
}) => {
  set(value);
};

const CanListenDependsOnAPI: ComponentDependsOnAPI<UseAPItoListen> = useAPI => ({
  subscribeId,
  initialValue,
  testId = '',
  countRender = () => {},
  children,
}) => {
  const state = useAPI(subscribeId, initialValue);
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

const CanUpdateDependsOnAPI: ComponentDependsOnAPI<UseAPItoUpdate> = useAPI => ({
  subscribeId,
  initialValue,
  testId = '',
  composeCallback = defaultComposeCallback,
  countRender = () => {},
  children,
}) => {
  const setState = useAPI(subscribeId, initialValue);
  const callback = useCallback(composeCallback(setState), [
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

const CanListenAndUpdateDependsOnAPI: ComponentDependsOnAPI<UseAPItoListenAndUpdate> = useAPI => ({
  subscribeId,
  initialValue,
  testId = '',
  composeCallback = defaultComposeCallback,
  countRender = () => {},
  children,
}) => {
  const [state, setState] = useAPI(subscribeId, initialValue);
  const callback = useCallback(composeCallback(setState), [
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
  useSetInterstate: typeof useSetInterstate;
  useSubscribeInterstate: typeof useSubscribeInterstate;
}

interface AssetsImport {
  render: typeof newRender;
  getLastMap: typeof getLastMap;
  fireEvent: typeof fireEvent;
  executionCountersFactory: typeof executionCountersFactory;
  CanListenDependsOnAPI: typeof CanListenDependsOnAPI;
  CanUpdateDependsOnAPI: typeof CanUpdateDependsOnAPI;
  CanListenAndUpdateDependsOnAPI: typeof CanListenAndUpdateDependsOnAPI;
}

interface TestParameter {
  assets: AssetsImport & UseInterstateImport;
}

type TestDescription = (
  p: TestParameter,
  createTestComponents: CreateTestComponents,
) => [string, () => void];

type CreateTestComponents = (
  p: TestParameter,
) => {
  CanListen: React.FunctionComponent<TestComponentsProps>;
  CanUpdate: React.FunctionComponent<TestComponentsProps>;
  CanListenAndUpdate: React.FunctionComponent<TestComponentsProps>;
};

export {
  newRender as render,
  getLastMap,
  fireEvent,
  executionCountersFactory,
  FieldsValue,
  InterstateID,
  CanListenDependsOnAPI,
  CanUpdateDependsOnAPI,
  CanListenAndUpdateDependsOnAPI,
  TestParameter,
  TestDescription,
  ComposeCallback,
  AssetsImport,
  UseInterstateImport,
  CreateTestComponents,
};
