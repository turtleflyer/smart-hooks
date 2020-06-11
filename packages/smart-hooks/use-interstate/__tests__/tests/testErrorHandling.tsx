import React from 'react';
import type { UseInterstateError } from '../../src/errorHandle';
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
        getUseInterstateErrorServices,
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

    const ErrorFallBack = () => <div data-testid={testId4}>Error</div>;

    interface TestComponentChildrenArg {
      subscribeId?: number;
      initV1?: string;
      initV2?: string;
      initV3?: string;
    }

    interface TestComponentProps extends TestComponentChildrenArg {
      resetErrorState?: boolean;
    }

    interface ErrorBoundaryProps extends TestComponentProps {
      children(arg: TestComponentChildrenArg): React.ReactElement | null;
    }

    class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
      constructor(props: ErrorBoundaryProps) {
        super(props);
      }

      state = { hasError: false };

      static getDerivedStateFromError() {
        return { hasError: true };
      }

      componentDidCatch(error: Error | UseInterstateError) {
        const errorServices = getUseInterstateErrorServices(error);
        if (errorServices) {
          const { flushValueOfKey } = errorServices;
          flushValueOfKey!();
        } else {
          throw error as Error;
        }
      }

      componentDidUpdate() {
        if (this.props.resetErrorState && this.state.hasError) {
          this.setState({ hasError: false });
        }
      }

      render() {
        const { children, ...restProps } = this.props;
        const { hasError } = this.state;

        return <>{hasError ? <ErrorFallBack /> : children(restProps)}</>;
      }
    }

    const TestComponent: React.FunctionComponent<TestComponentProps> = (props) => (
      <ErrorBoundary {...props}>
        {({ subscribeId = subscribeId1, initV1, initV2, initV3 }: TestComponentChildrenArg) => (
          <>
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
          </>
        )}
      </ErrorBoundary>
    );

    const { getTextFromNode, rerender, unmount, getByTestId } = render(
      <TestComponent initV1="Java" />
    );
    const settersCounter = settersCounterFactory();
    expect(getTextFromNode(testId1)).toBe('Java');
    expect(getTextFromNode(testId2)).toBe('Java');
    expect(getTextFromNode(testId3)).toBe('Java');
    expect(countRender1.howManyTimesBeenCalled()).toBe(1);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(1);

    assertWrapper(() =>
      rerender(<TestComponent subscribeId={subscribeId2} initV1="Python" initV2="JavaScript" />)
    );
    expect(getByTestId(testId4).textContent).toBe('Error');

    rerender(<TestComponent resetErrorState={true} subscribeId={subscribeId2} initV1="Python" />);
    expect(getTextFromNode(testId1)).toBe('Python');
    expect(getTextFromNode(testId2)).toBe('Python');
    expect(getTextFromNode(testId3)).toBe('Python');
    expect(countRender1.howManyTimesBeenCalled()).toBe(2);
    expect(countRender2.howManyTimesBeenCalled()).toBe(3);
    expect(countRender3.howManyTimesBeenCalled()).toBe(3);
    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId1)).toBe(0);
    }

    assertWrapper(() => rerender(<TestComponent subscribeId={subscribeId3} />));
    expect(getByTestId(testId4).textContent).toBe('Error');

    rerender(
      <TestComponent resetErrorState={true} subscribeId={subscribeId3} initV1="TypeScript" />
    );

    expect(getTextFromNode(testId1)).toBe('TypeScript');
    expect(getTextFromNode(testId2)).toBe('TypeScript');
    expect(getTextFromNode(testId3)).toBe('TypeScript');
    expect(countRender1.howManyTimesBeenCalled()).toBe(3);
    expect(countRender2.howManyTimesBeenCalled()).toBe(4);
    expect(countRender3.howManyTimesBeenCalled()).toBe(4);
    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId1)).toBe(0);
      expect(settersCounter(subscribeId2)).toBe(0);
    }

    unmount();
    if (flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      expect(settersCounter(subscribeId1)).toBe(0);
      expect(settersCounter(subscribeId2)).toBe(0);
    }
  },
];

export default testErrorHandling;
