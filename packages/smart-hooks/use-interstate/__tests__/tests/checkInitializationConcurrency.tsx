import { cleanup } from '@testing-library/react';
import type { FC } from 'react';
import React, { StrictMode } from 'react';
import type { TestDescription } from '../testsAssets';

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
        getUseInterstateErrorsHandleMethods,
      },
    } = p;
    const subscribeId = '1';
    const testId = 'first';
    const [assertWrapper, errorRecord] = createAssertWrapper();

    const InnerComponent: FC<{
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

    const TestComponent: FC<{
      initV1?: string;
      initV2?: string;
      initV3?: string;
    }> = ({ initV1, initV2, initV3 }) => (
      <StrictMode>
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
      </StrictMode>
    );

    expect(() =>
      assertWrapper(() => render(<TestComponent initV1="a" initV2="b" initV3="c" />))
    ).toThrow(/\(useInterstate Error\) .* concurrently/);

    getUseInterstateErrorsHandleMethods(errorRecord.current)?.flushValueOfKey?.(true);
    cleanup();

    expect(() => assertWrapper(() => render(<TestComponent initV1="d" initV2="e" />))).toThrow(
      /\(useInterstate Error\) .* concurrently/
    );

    getUseInterstateErrorsHandleMethods(errorRecord.current)?.flushValueOfKey?.(true);
    cleanup();

    expect(() => assertWrapper(() => render(<TestComponent initV1="f" initV3="g" />))).toThrow(
      /\(useInterstate Error\) .* concurrently/
    );

    getUseInterstateErrorsHandleMethods(errorRecord.current)?.flushValueOfKey?.(true);
    cleanup();

    expect(() => assertWrapper(() => render(<TestComponent initV2="h" initV3="i" />))).toThrow(
      /\(useInterstate Error\) .* concurrently/
    );

    getUseInterstateErrorsHandleMethods(errorRecord.current)?.flushValueOfKey?.(true);
    cleanup();

    const { unmount, getTextFromNode } = render(<TestComponent initV1="j" />);
    expect(getTextFromNode(testId)).toBe('j');

    unmount();
  },
];

export default checkInitializationConcurrency;
