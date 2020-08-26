/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line import/no-unresolved
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import React, { useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { executionCountersFactory } from '../../../../test_utilities/executionCounter';
import type {
  TestDescriptionG,
  TestParameterG,
} from '../../../../test_utilities/testDescriptionTypes';
import { wrapWithStrictModeComponent } from '../../../../test_utilities/wrapWithStrictModeComponent';
import * as mockedCreateStoreStateImport from '../src/createStoreState';
import {
  getUseInterstate,
  getUseInterstateErrorsHandleMethods,
  isUseInterstateError,
  Scope,
  useInterstate,
} from '../src/useInterstate';
import type {
  InterstateInitializeParam,
  InterstateParam,
  UseInterstateError,
} from '../src/useInterstate';
import type { SettersCounterFactory } from '../src/__mocks__/createStoreState';

jest.mock('../src/createStoreState.ts');

const { settersCounterFactory } = (mockedCreateStoreStateImport as unknown) as {
  settersCounterFactory: SettersCounterFactory;
};

type ExtractFirstArgType<T> = T extends (firstArg: infer R, ...restArg: never[]) => unknown
  ? R
  : never;

function newRender(
  arg: ExtractFirstArgType<typeof render>
): RenderResult & {
  fireNode: (testId: string, value: string) => void;
  getTextFromNode: (testId: string) => string;
} {
  const fromRender = render(arg);
  const { getByTestId } = fromRender;

  const fireNode = (testId: string, value: string) => {
    const element = getByTestId(testId);
    if (element) {
      const inputChild = element.querySelector(`[data-testid=${testId}] > input`);
      if (inputChild) {
        fireEvent.change(inputChild, {
          target: { value },
        });
      }
    }
  };

  const getTextFromNode = (testId: string): string => {
    const element = getByTestId(testId);
    return element && element.firstChild && element.firstChild.nodeName === '#text'
      ? (element.firstChild.textContent as string)
      : '';
  };

  return { ...fromRender, fireNode, getTextFromNode };
}

type FieldsValue = string;
type InitType = InterstateInitializeParam<FieldsValue>;
type InterstateID = string | number | symbol;

export type ComposeCallback = (
  set: (v: InterstateParam<FieldsValue>) => void
) => ({ target: { value } }: { target: { value: string } }) => void;

interface TestComponentsProps {
  readonly subscribeId: InterstateID;
  readonly initialValue?: InitType;
  readonly testId?: string;
  readonly composeCallback?: ComposeCallback;
  readonly countRender?: () => void;
}

const defaultComposeCallback: ComposeCallback = (set) => ({ target: { value } }) => {
  set(value);
};

type ComposeComponent = (importedUseInterstate: typeof useInterstate) => FC<TestComponentsProps>;

const composeCanListen: ComposeComponent = (importedUseInterstate) => {
  const Inner: FC<TestComponentsProps> = ({
    subscribeId,
    initialValue,
    testId = '',
    countRender = () => {},
    children,
  }) => {
    const [useSubscribe] = importedUseInterstate(subscribeId, initialValue);
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

  return wrapWithStrictModeComponent(Inner);
};

const composeCanUpdate: ComposeComponent = (importedUseInterstate) => {
  const Inner: FC<TestComponentsProps> = ({
    subscribeId,
    initialValue,
    testId = '',
    composeCallback = defaultComposeCallback,
    countRender = () => {},
    children,
  }) => {
    const [, setState] = importedUseInterstate(subscribeId, initialValue);
    const callback = useMemo(() => composeCallback(setState), [composeCallback, setState]);
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

  return wrapWithStrictModeComponent(Inner);
};

const composeCanListenAndUpdate: ComposeComponent = (importedUseInterstate) => {
  const Inner: FC<TestComponentsProps> = ({
    subscribeId,
    initialValue,
    testId = '',
    composeCallback = defaultComposeCallback,
    countRender = () => {},
    children,
  }) => {
    const [useSubscribe, setState] = importedUseInterstate(subscribeId, initialValue);
    const state = useSubscribe();
    const callback = useMemo(() => composeCallback(setState), [composeCallback, setState]);
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

  return wrapWithStrictModeComponent(Inner);
};

interface ErrorRecord {
  current: Error | UseInterstateError;
}

type AssertWrapperCreator = () => [<R>(a: () => R) => R | never, ErrorRecord];

const createAssertWrapper: AssertWrapperCreator = () => {
  const errorRecord = {} as ErrorRecord;
  return [
    function assertWrapper(a) {
      const originalErrorLogging = console.error;
      console.error = jest.fn();
      try {
        return a();
      } catch (e) {
        errorRecord.current = e;

        throw e;
      } finally {
        console.error = originalErrorLogging;
      }
    },
    errorRecord,
  ];
};

export interface UseInterstateImport {
  readonly getUseInterstate: typeof getUseInterstate;
  readonly Scope: typeof Scope;
  readonly useInterstate: typeof useInterstate;
  readonly getUseInterstateErrorsHandleMethods: typeof getUseInterstateErrorsHandleMethods;
  readonly isUseInterstateError: typeof isUseInterstateError;
}

export interface AssetsImport {
  readonly render: typeof newRender;
  readonly settersCounterFactory: SettersCounterFactory;
  readonly executionCountersFactory: typeof executionCountersFactory;
  readonly createAssertWrapper: AssertWrapperCreator;
  readonly wrapWithStrictModeComponent: typeof wrapWithStrictModeComponent;
  readonly composeCanListen: ComposeComponent;
  readonly composeCanUpdate: ComposeComponent;
  readonly composeCanListenAndUpdate: ComposeComponent;
}

export type TestParameter = TestParameterG<
  AssetsImport &
    UseInterstateImport & {
      readonly CanListen: FC<TestComponentsProps>;
      readonly CanUpdate: FC<TestComponentsProps>;
      readonly CanListenAndUpdate: FC<TestComponentsProps>;
    }
>;

export type TestDescription = TestDescriptionG<TestParameter>;

export {
  newRender as render,
  settersCounterFactory,
  executionCountersFactory,
  composeCanListen,
  composeCanUpdate,
  composeCanListenAndUpdate,
  createAssertWrapper,
  wrapWithStrictModeComponent,
};
