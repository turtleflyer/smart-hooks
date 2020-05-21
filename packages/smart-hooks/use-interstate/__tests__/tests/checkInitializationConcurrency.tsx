import React from 'react';
import { TestDescription } from '../testsAssets';
import { cleanup, act } from '@testing-library/react';

const checkInitializationConcurrency: TestDescription = (p) => [
  'check initialization concurrency',
  () => {
    const {
      assets: {
        render,
        CanListen,
        CanUpdate,
        CanListenAndUpdate,
        createAssertWrapper,
        getUseInterstateErrorMethods,
      },
    } = p;
    const subscribeId = '1';
    const testId = 'first';
    const [assertWrapper, errorRecord] = createAssertWrapper();

    const InnerComponent: React.FunctionComponent<{
      initV?: string;
    }> = ({ initV }) => (
      <div>
        <CanListen
          {...{
            subscribeId,
            initialValue: initV,
          }}
        />
      </div>
    );

    const TestComponent: React.FunctionComponent<{
      initV1?: string;
      initV2?: string;
      initV3?: string;
    }> = ({ initV1, initV2, initV3 }) => (
      <>
        <div>
          <div>
            <CanUpdate
              {...{
                subscribeId,
                initialValue: initV1,
              }}
            />
            <InnerComponent initV={initV2} />
          </div>
        </div>
        <CanListenAndUpdate
          {...{
            subscribeId,
            testId,
            initialValue: initV3,
          }}
        />
      </>
    );

    expect(() =>
      assertWrapper(() => render(<TestComponent initV1="a" initV2="b" initV3="c" />))
    ).toThrow(/\(useInterstate Error\) .* concurrently/);

    getUseInterstateErrorMethods(errorRecord.current)!.flushValueOfKey!();
    cleanup();

    expect(() => assertWrapper(() => render(<TestComponent initV1="d" initV2="e" />))).toThrow(
      /\(useInterstate Error\) .* concurrently/
    );

    getUseInterstateErrorMethods(errorRecord.current)!.flushValueOfKey!();
    cleanup();

    expect(() => assertWrapper(() => render(<TestComponent initV1="f" initV3="g" />))).toThrow(
      /\(useInterstate Error\) .* concurrently/
    );

    getUseInterstateErrorMethods(errorRecord.current)!.flushValueOfKey!();
    cleanup();

    expect(() => assertWrapper(() => render(<TestComponent initV2="h" initV3="i" />))).toThrow(
      /\(useInterstate Error\) .* concurrently/
    );

    getUseInterstateErrorMethods(errorRecord.current)!.flushValueOfKey!();
    cleanup();

    const { unmount, getTextFromNode } = render(<TestComponent initV1="j" />);
    expect(getTextFromNode(testId)).toBe('j');

    unmount();
  },
];

export default checkInitializationConcurrency;
