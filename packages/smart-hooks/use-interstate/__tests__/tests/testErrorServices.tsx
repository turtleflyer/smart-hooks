import { cleanup } from '@testing-library/react';
import React from 'react';
import type { UseInterstateError } from '../../src/useInterstate';
import type { TestDescription } from '../testsAssets';

const testErrorServices: TestDescription = (p) => [
  'error services work properly',
  async () => {
    const {
      assets: {
        render,
        CanListen,
        createAssertWrapper,
        getUseInterstateErrorServices,
        isUseInterstateError,
      },
    } = p;

    const [assertWrapper, errorRecord] = createAssertWrapper();
    const subscribeId1 = 1;
    const subscribeId2 = 2;

    function awaitTimeout(t: number) {
      const wait = new Promise((r) => setTimeout(r, t));
      jest.advanceTimersByTime(t);
      return wait;
    }

    interface ErrorEmitterProps {
      subscribeId?: number;
      initV1?: string;
      initV2?: string;
    }

    const ErrorEmitter: React.FunctionComponent<ErrorEmitterProps> = ({
      subscribeId = subscribeId1,
      initV1,
      initV2,
    }) => (
      <>
        <CanListen
          {...{
            subscribeId,
            initialValue: initV1,
          }}
        />
        <CanListen
          {...{
            subscribeId,
            initialValue: initV2,
          }}
        />
      </>
    );

    jest.useFakeTimers();
    jest.advanceTimersByTime(20000);

    expect(() => assertWrapper(() => render(<ErrorEmitter />))).toThrow('(useInterstate Error)');
    const { current: error1 } = errorRecord;
    cleanup();

    await awaitTimeout(10000);

    expect(() =>
      assertWrapper(() => render(<ErrorEmitter initV1="father" initV2="son" />))
    ).toThrow('(useInterstate Error)');
    const { current: error2 } = errorRecord;
    cleanup();

    await awaitTimeout(4000);

    expect(() =>
      assertWrapper(() =>
        render(<ErrorEmitter subscribeId={subscribeId2} initV1="mother" initV2="daughter" />)
      )
    ).toThrow('(useInterstate Error)');
    const { current: error3 } = errorRecord;
    cleanup();

    await awaitTimeout(4000);

    const [errorServices1, errorServices2, errorServices3] = ([
      error1,
      error2,
      error3,
    ] as UseInterstateError[]).map((e) => getUseInterstateErrorServices(e));

    await awaitTimeout(1000);

    expect(
      ([error1, error2, error3] as (Error | UseInterstateError)[]).map(
        (e) => getUseInterstateErrorServices(e) !== undefined
      )
    ).toEqual([true, true, true]);

    await awaitTimeout(2000);

    expect(
      ([error1, error2, error3] as (Error | UseInterstateError)[]).map(
        (e) => getUseInterstateErrorServices(e) !== undefined
      )
    ).toEqual([false, true, true]);

    await awaitTimeout(10000);

    expect(
      ([error1, error2, error3] as (Error | UseInterstateError)[]).map(
        (e) => getUseInterstateErrorServices(e) !== undefined
      )
    ).toEqual([false, false, false]);

    expect(errorServices1.flushValueOfKey!()).toBeTruthy();
    expect(errorServices2.flushValueOfKey!()).toBeFalsy();
    expect(errorServices3.flushValueOfKey!()).toBeTruthy();

    let curError: Error;
    function throwExpectedError() {
      expect(() => assertWrapper(() => render(<ErrorEmitter initV1="no" initV2="yes" />))).toThrow(
        '(useInterstate Error)'
      );
      ({ current: curError } = errorRecord);
      cleanup();
    }

    for (let i = 0; i < 50; i++) {
      throwExpectedError();
    }
    expect(isUseInterstateError(curError!)).toBeTruthy();

    for (let i = 0; i < 51; i++) {
      throwExpectedError();
    }
    expect(isUseInterstateError(curError!)).toBeFalsy();
  },
];

export default testErrorServices;
