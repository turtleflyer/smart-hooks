import React, { Component, useEffect } from 'react';
import type { FC } from 'react';
import type { UseInterstateError } from '../../src/useInterstate';
import { flagManager } from '../testFlags';
import type { TestDescription } from '../testsAssets';

const testErrorHandling: TestDescription = (p) => [
  'error handling works',
  () => {
    const {
      assets: {
        render,
        settersCounterFactory,
        executionCountersFactory,
        CanListen,
        createAssertWrapper,
        getUseInterstateErrorsHandleMethods,
        isUseInterstateError,
        useInterstate,
      },
    } = p;

    const [assertWrapper] = createAssertWrapper();
    const testId1 = 'first';
    const testId2 = 'second';
    const testId3 = 'third';
    const testId4 = 'third';
    const countRender1 = executionCountersFactory();
    const countRender2 = executionCountersFactory();
    const countRender3 = executionCountersFactory();
    const subscribeId1 = 1;
    const subscribeId2 = 2;
    const subscribeId3 = 3;
    const subscribeId4 = 4;

    const ErrorFallBack: FC = () => <div data-testid={testId4}>Error</div>;

    interface ErrorBoundaryProps {
      resetErrorState?: { restoreValue: boolean };
    }

    interface ErrorBoundaryState {
      error?: Error | UseInterstateError | undefined;
    }

    class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
      state = {} as ErrorBoundaryState;

      static getDerivedStateFromError(error: Error | UseInterstateError) {
        if (isUseInterstateError(error)) {
          return { error };
        }
        // eslint-disable-next-line no-throw-literal
        throw error as Error;
      }

      static getDerivedStateFromProps(
        nextProps: ErrorBoundaryProps,
        prevState: ErrorBoundaryState
      ): Partial<ErrorBoundaryState> | null {
        const { resetErrorState } = nextProps;
        const { error } = prevState;
        if (error && resetErrorState) {
          getUseInterstateErrorsHandleMethods(error)?.flushValueOfKey?.(
            resetErrorState.restoreValue
          );
          return { error: undefined };
        }

        return null;
      }

      render() {
        return <>{this.state.error ? <ErrorFallBack /> : this.props.children}</>;
      }
    }

    const ThrowMultipleAttempt: FC<{
      throwError: boolean;
      subscribeId: number;
      value: string;
    }> = ({ throwError, subscribeId, value }) => {
      const [, setInterstate] = useInterstate(subscribeId);

      useEffect(() => {
        if (throwError) {
          setInterstate(value);
        }
      }, [setInterstate, throwError, value]);

      return <></>;
    };

    interface TestComponentProps extends ErrorBoundaryProps {
      subscribeId?: number;
      initV1?: string;
      initV2?: string;
      initV3?: string;
      throwError?: boolean;
    }

    const TestComponent: FC<TestComponentProps> = ({
      subscribeId = subscribeId1,
      initV1,
      initV2,
      initV3,
      resetErrorState,
      throwError = false,
    }) => (
      <ErrorBoundary {...{ resetErrorState }}>
        <CanListen
          {...{
            subscribeId,
            testId: testId1,
            countRender: countRender1.count,
            initialValue: initV1,
          }}
        />
        <CanListen
          {...{
            subscribeId,
            testId: testId2,
            countRender: countRender2.count,
            initialValue: initV2,
          }}
        />
        <CanListen
          {...{
            subscribeId,
            testId: testId3,
            countRender: countRender3.count,
            initialValue: initV3,
          }}
        />

        <ThrowMultipleAttempt {...{ subscribeId, throwError, value: 'wrong' }} />
        <ThrowMultipleAttempt {...{ subscribeId, throwError, value: 'wronger' }} />
      </ErrorBoundary>
    );

    const { getTextFromNode, rerender, unmount, getByTestId } = render(
      <TestComponent initV1="Java" />
    );
    const settersCounter = settersCounterFactory();

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId1)).toBe('Java');
      expect(getTextFromNode(testId2)).toBe('Java');
      expect(getTextFromNode(testId3)).toBe('Java');
    } else {
      expect(countRender1.howManyTimesBeenCalled()).toBe(1);
      expect(countRender2.howManyTimesBeenCalled()).toBe(1);
      expect(countRender3.howManyTimesBeenCalled()).toBe(1);
    }

    assertWrapper(() =>
      rerender(<TestComponent subscribeId={subscribeId2} initV1="Python" initV2="JavaScript" />)
    );

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getByTestId(testId4).textContent).toBe('Error');
    }

    rerender(
      <TestComponent
        resetErrorState={{ restoreValue: false }}
        subscribeId={subscribeId2}
        initV1="LISP"
      />
    );

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId1)).toBe('Python');
      expect(getTextFromNode(testId2)).toBe('Python');
      expect(getTextFromNode(testId3)).toBe('Python');
    } else {
      expect(countRender1.howManyTimesBeenCalled()).toBe(2);
      expect(countRender2.howManyTimesBeenCalled()).toBe(2);
      expect(countRender3.howManyTimesBeenCalled()).toBe(2);
    }

    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId1)).toBe(0);
    }

    assertWrapper(() => rerender(<TestComponent subscribeId={subscribeId3} />));

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getByTestId(testId4).textContent).toBe('Error');
    }

    rerender(
      <TestComponent
        resetErrorState={{ restoreValue: true }}
        subscribeId={subscribeId3}
        initV1="TypeScript"
      />
    );

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId1)).toBe('TypeScript');
      expect(getTextFromNode(testId2)).toBe('TypeScript');
      expect(getTextFromNode(testId3)).toBe('TypeScript');
    } else {
      expect(countRender1.howManyTimesBeenCalled()).toBe(3);
      expect(countRender2.howManyTimesBeenCalled()).toBe(3);
      expect(countRender3.howManyTimesBeenCalled()).toBe(3);
    }

    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId1)).toBe(0);
      expect(settersCounter(subscribeId2)).toBe(0);
    }

    rerender(
      <TestComponent
        resetErrorState={{ restoreValue: true }}
        subscribeId={subscribeId4}
        initV1="Algol"
        initV2="Algol"
        initV3="Algol"
      />
    );

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId1)).toBe('Algol');
      expect(getTextFromNode(testId2)).toBe('Algol');
      expect(getTextFromNode(testId3)).toBe('Algol');
    } else {
      expect(countRender1.howManyTimesBeenCalled()).toBe(4);
      expect(countRender2.howManyTimesBeenCalled()).toBe(4);
      expect(countRender3.howManyTimesBeenCalled()).toBe(4);
    }

    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId1)).toBe(0);
      expect(settersCounter(subscribeId2)).toBe(0);
      expect(settersCounter(subscribeId3)).toBe(0);
      expect(settersCounter(subscribeId4)).toBe(3);
    }

    assertWrapper(() => rerender(<TestComponent throwError />));

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getByTestId(testId4).textContent).toBe('Error');
    }

    rerender(<TestComponent resetErrorState={{ restoreValue: true }} />);

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId1)).toBe('Java');
      expect(getTextFromNode(testId2)).toBe('Java');
      expect(getTextFromNode(testId3)).toBe('Java');
    } else {
      expect(countRender1.howManyTimesBeenCalled()).toBe(6);
      expect(countRender2.howManyTimesBeenCalled()).toBe(6);
      expect(countRender3.howManyTimesBeenCalled()).toBe(6);
    }

    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId2)).toBe(0);
      expect(settersCounter(subscribeId3)).toBe(0);
      expect(settersCounter(subscribeId4)).toBe(0);
    }

    assertWrapper(() => rerender(<TestComponent throwError />));

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getByTestId(testId4).textContent).toBe('Error');
    }

    rerender(<TestComponent resetErrorState={{ restoreValue: false }} />);

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(getTextFromNode(testId1)).toBe('wrong');
      expect(getTextFromNode(testId2)).toBe('wrong');
      expect(getTextFromNode(testId3)).toBe('wrong');
    } else {
      expect(countRender1.howManyTimesBeenCalled()).toBe(8);
      expect(countRender2.howManyTimesBeenCalled()).toBe(8);
      expect(countRender3.howManyTimesBeenCalled()).toBe(8);
    }

    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId2)).toBe(0);
      expect(settersCounter(subscribeId3)).toBe(0);
      expect(settersCounter(subscribeId4)).toBe(0);
    }

    unmount();
    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId2)).toBe(0);
      expect(settersCounter(subscribeId3)).toBe(0);
      expect(settersCounter(subscribeId4)).toBe(0);
    }
  },
];

export default testErrorHandling;
