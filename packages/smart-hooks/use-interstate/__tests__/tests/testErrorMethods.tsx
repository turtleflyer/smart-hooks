import { cleanup } from '@testing-library/react';
import React, { useEffect } from 'react';
import type { UseInterstateError } from '../../src/useInterstate';
import type { TestDescription } from '../testsAssets';

const testErrorMethods: TestDescription = (p) => [
  'error methods work properly',
  async () => {
    const {
      assets: {
        render,
        CanListen,
        createAssertWrapper,
        getUseInterstateErrorsHandleMethods,
        isUseInterstateError,
        useInterstate,
      },
    } = p;

    const [assertWrapper, errorRecord] = createAssertWrapper();
    const subscribeId1 = 1;
    const subscribeId2 = 2;
    const subscribeId3 = 3;
    const subscribeId4 = 4;

    function awaitTimeout(t: number) {
      const wait = new Promise((r) => setTimeout(r, t));
      jest.advanceTimersByTime(t);
      return wait;
    }

    const ErrorEmitterRegardingInit: React.FunctionComponent<{
      subscribeId?: number;
      initV1?: string;
      initV2?: string;
    }> = ({ subscribeId = subscribeId1, initV1, initV2 }) => (
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

    const InnerSet: React.FunctionComponent<{ toSet: string }> = ({ toSet }) => {
      const [, setInterstate] = useInterstate<string>(subscribeId3);

      useEffect(() => setInterstate(toSet));

      return <div>should be last</div>;
    };

    const InnerInit: React.FunctionComponent = () => {
      const [useSubscribe] = useInterstate(subscribeId3, 'cold');
      const val = useSubscribe();

      return <div>{val}</div>;
    };

    const ErrorEmitterRegardingSetValue: React.FunctionComponent = () => {
      return (
        <>
          <InnerSet toSet="warm" />
          <InnerInit />
          <InnerSet toSet="hot" />
        </>
      );
    };

    jest.useFakeTimers();
    jest.advanceTimersByTime(20000);

    expect(() => assertWrapper(() => render(<ErrorEmitterRegardingInit />))).toThrow(
      /(useInterstate Error).*value never been set/
    );
    const { current: error1 } = errorRecord;
    cleanup();

    await awaitTimeout(10000);

    expect(() =>
      assertWrapper(() => render(<ErrorEmitterRegardingInit initV1="father" initV2="son" />))
    ).toThrow(/(useInterstate Error).*concurrently during the same rendering cycle/);
    const { current: error2 } = errorRecord;
    cleanup();

    await awaitTimeout(4000);

    expect(() =>
      assertWrapper(() =>
        render(
          <ErrorEmitterRegardingInit subscribeId={subscribeId2} initV1="mother" initV2="daughter" />
        )
      )
    ).toThrow(/(useInterstate Error).*concurrently during the same rendering cycle/);
    const { current: error3 } = errorRecord;
    cleanup();

    await awaitTimeout(2000);

    expect(() => assertWrapper(() => render(<ErrorEmitterRegardingSetValue />))).toThrow(
      /(useInterstate Error).*Multiple attempt of setting value/
    );
    const { current: error4 } = errorRecord;
    cleanup();

    await awaitTimeout(2000);

    const [errorMethods1, errorMethods2, errorMethods3, errorMethods4] = ([
      error1,
      error2,
      error3,
      error4,
    ] as UseInterstateError[]).map((e) => getUseInterstateErrorsHandleMethods(e));

    await awaitTimeout(1000);

    expect(
      ([error1, error2, error3, error4] as (Error | UseInterstateError)[]).map(
        (e) => getUseInterstateErrorsHandleMethods(e) !== undefined
      )
    ).toEqual([true, true, true, true]);

    await awaitTimeout(2000);

    expect(
      ([error1, error2, error3, error4] as (Error | UseInterstateError)[]).map(
        (e) => getUseInterstateErrorsHandleMethods(e) !== undefined
      )
    ).toEqual([false, true, true, true]);

    await awaitTimeout(10000);

    expect(
      ([error1, error2, error3, error4] as (Error | UseInterstateError)[]).map(
        (e) => getUseInterstateErrorsHandleMethods(e) !== undefined
      )
    ).toEqual([false, false, false, false]);

    expect(errorMethods1.flushValueOfKey!()).toBeTruthy();
    expect(errorMethods2.flushValueOfKey!()).toBeFalsy();
    expect(errorMethods3.flushValueOfKey!()).toBeTruthy();
    expect(errorMethods4.flushValueOfKey!()).toBeTruthy();

    let curError: Error | UseInterstateError;
    function throwExpectedError() {
      expect(() =>
        assertWrapper(() =>
          render(<ErrorEmitterRegardingInit subscribeId={subscribeId4} initV1="no" initV2="yes" />)
        )
      ).toThrow(
        /(useInterstate Error).*(concurrently during the same rendering cycle|Too many errors have been occurring)/
      );
      ({ current: curError } = errorRecord);
      const errorMethods = getUseInterstateErrorsHandleMethods(curError);
      errorMethods?.flushValueOfKey!(true);
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

export default testErrorMethods;
