import { cleanup, fireEvent, render } from '@testing-library/react';
import type { ExecutionCounter } from '@~internal/test-utilities/executionCounter';
import type { FC } from 'react';
import React, { memo, useEffect } from 'react';
import type { InterstateInitializeObject, InterstateSettersObject } from '../../src/useInterstate';
import { flagManager } from '../testFlags';
import type { TestDescription } from '../testsAssets';

const testMultistateInterface: TestDescription = (p) => [
  'test multistate interface',
  () => {
    const {
      assets: {
        executionCountersFactory,
        wrapWithStrictModeComponent,
        useInterstate,
        Scope,
        createAssertWrapper,
      },
    } = p;

    const [assertWrapper] = createAssertWrapper();
    const storeComponentCounter = executionCountersFactory();
    const mixedComponentCounter = executionCountersFactory();
    const testComponentCounter = executionCountersFactory();

    function useCounter(counter: ExecutionCounter) {
      useEffect(() => counter.count());
    }

    const testId0 = 'store-name-input-1';
    const testId1 = 'store-location-input';
    const testId2 = 'store-location-1';
    const testId3 = 'customer-name-1';
    const testId4 = 'store-name-input-2';
    const testId5 = 'customer-name-input-1';
    const testId6 = 'customer-gender-input-1';
    const testId7 = 'store-name';
    const testId8 = 'store-location-2';
    const testId9 = 'customer-name-2';
    const testId10 = 'customer-gender';
    const testId11 = 'customer-name-input-2';
    const testId12 = 'customer-gender-input-2';

    const customerName = Symbol('customer name');
    const customerGender = Symbol('customer gender');

    interface AppState {
      storeName: string | undefined;
      storeLocation: string | undefined;
      [customerName]: string | undefined;
      [customerGender]: string | undefined;
    }

    type InputFormProps<S extends Partial<AppState>, P extends keyof S> = {
      labelText: string;
      dataTestId: string;
      setters: InterstateSettersObject<S>;
      keyOfState: P;
    };

    type InputFormComponent = <S extends Partial<AppState>, P extends keyof S>(
      arg: InputFormProps<S, P>
    ) => ReturnType<FC<InputFormProps<S, P>>>;

    const InputForm: InputFormComponent = <S extends Partial<AppState>, P extends keyof S>({
      labelText,
      dataTestId,
      setters,
      keyOfState,
    }: InputFormProps<S, P>) => (
      <form>
        <label>
          {labelText}
          <input
            data-testid={dataTestId}
            type="text"
            onChange={(e) =>
              (setters as InterstateSettersObject<AppState>)[keyOfState as keyof AppState](
                e.target.value
              )
            }
          />
        </label>
      </form>
    );

    const DisplayPieceOfState: FC<{
      pieceOfState: string | undefined;
      dataTestId: string;
    }> = ({ pieceOfState, dataTestId }) => (
      <div data-testid={dataTestId}>{pieceOfState ?? 'N/A'}</div>
    );

    const Store: FC = memo(() => {
      const [, setState] = useInterstate({ storeName: undefined, storeLocation: undefined });
      useCounter(storeComponentCounter);

      return (
        <>
          <InputForm
            labelText="Input store name"
            dataTestId={testId0}
            setters={setState}
            keyOfState="storeName"
          />
          <InputForm
            labelText="Input store location"
            dataTestId={testId1}
            setters={setState}
            keyOfState="storeLocation"
          />
        </>
      );
    });

    const Mixed: FC = memo(() => {
      const [, setState] = useInterstate({
        storeName: undefined,
        [customerName]: undefined,
        [customerGender]: undefined,
      });
      const [useSubscribe] = useInterstate({ storeLocation: undefined, [customerName]: undefined });
      const state = useSubscribe();

      useCounter(mixedComponentCounter);

      return (
        <>
          <DisplayPieceOfState pieceOfState={state.storeLocation} dataTestId={testId2} />
          <DisplayPieceOfState pieceOfState={state[customerName]} dataTestId={testId3} />
          <InputForm
            labelText="Input store name"
            dataTestId={testId4}
            setters={setState}
            keyOfState="storeName"
          />
          <InputForm
            labelText="Input customer name"
            dataTestId={testId5}
            setters={setState}
            keyOfState={customerName}
          />
          <InputForm
            labelText="Input customer gender"
            dataTestId={testId6}
            setters={setState}
            keyOfState={customerGender}
          />
        </>
      );
    });

    const TestComponent: FC<{
      defState: InterstateInitializeObject<AppState>;
    }> = wrapWithStrictModeComponent(({ defState }) => {
      useInterstate(defState);
      const [useSubscribeState, setState] = useInterstate({
        storeName: undefined,
        storeLocation: undefined,
        [customerName]: undefined,
        [customerGender]: () => undefined,
      });
      const customerState = useSubscribeState();
      useCounter(testComponentCounter);

      return (
        <>
          <Store />
          <Mixed />
          <DisplayPieceOfState pieceOfState={customerState.storeName} dataTestId={testId7} />
          <DisplayPieceOfState pieceOfState={customerState.storeLocation} dataTestId={testId8} />
          <DisplayPieceOfState pieceOfState={customerState[customerName]} dataTestId={testId9} />
          <DisplayPieceOfState pieceOfState={customerState[customerGender]} dataTestId={testId10} />
          <InputForm
            labelText="Input customer name"
            dataTestId={testId11}
            setters={setState}
            keyOfState={customerName}
          />
          <InputForm
            labelText="Input customer gender"
            dataTestId={testId12}
            setters={setState}
            keyOfState={customerGender}
          />
        </>
      );
    });

    const { queryByTestId } = render(
      <TestComponent
        defState={{
          storeName: () => undefined,
          storeLocation: () => undefined,
          [customerName]: () => undefined,
          [customerGender]: () => undefined,
        }}
      />
    );

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(queryByTestId(testId2)?.firstChild?.textContent).toBe('N/A');
      expect(queryByTestId(testId3)?.firstChild?.textContent).toBe('N/A');
      expect(queryByTestId(testId7)?.firstChild?.textContent).toBe('N/A');
      expect(queryByTestId(testId8)?.firstChild?.textContent).toBe('N/A');
    } else {
      expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(1);
      expect(mixedComponentCounter.howManyTimesBeenCalled()).toBe(1);
      expect(testComponentCounter.howManyTimesBeenCalled()).toBe(1);
    }

    let elementWithId = queryByTestId(testId0);
    expect(
      elementWithId && fireEvent.change(elementWithId, { target: { value: 'Walmart' } })
    ).toBeTruthy();

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(queryByTestId(testId7)?.firstChild?.textContent).toBe('Walmart');
    } else {
      expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(1);
      expect(mixedComponentCounter.howManyTimesBeenCalled()).toBe(1);
      expect(testComponentCounter.howManyTimesBeenCalled()).toBe(2);
    }

    elementWithId = queryByTestId(testId1);
    expect(
      elementWithId && fireEvent.change(elementWithId, { target: { value: 'North Pole' } })
    ).toBeTruthy();

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(queryByTestId(testId2)?.firstChild?.textContent).toBe('North Pole');
      expect(queryByTestId(testId8)?.firstChild?.textContent).toBe('North Pole');
    } else {
      expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(1);
      expect(mixedComponentCounter.howManyTimesBeenCalled()).toBe(2);
      expect(testComponentCounter.howManyTimesBeenCalled()).toBe(3);
    }

    elementWithId = queryByTestId(testId6);
    expect(
      elementWithId && fireEvent.change(elementWithId, { target: { value: 'male' } })
    ).toBeTruthy();

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(queryByTestId(testId10)?.firstChild?.textContent).toBe('male');
    } else {
      expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(1);
      expect(mixedComponentCounter.howManyTimesBeenCalled()).toBe(2);
      expect(testComponentCounter.howManyTimesBeenCalled()).toBe(4);
    }

    elementWithId = queryByTestId(testId12);
    expect(
      elementWithId && fireEvent.change(elementWithId, { target: { value: 'female' } })
    ).toBeTruthy();

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(queryByTestId(testId10)?.firstChild?.textContent).toBe('female');
    } else {
      expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(1);
      expect(mixedComponentCounter.howManyTimesBeenCalled()).toBe(2);
      expect(testComponentCounter.howManyTimesBeenCalled()).toBe(5);
    }

    elementWithId = queryByTestId(testId5);
    expect(
      elementWithId && fireEvent.change(elementWithId, { target: { value: 'Susan' } })
    ).toBeTruthy();

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(queryByTestId(testId3)?.firstChild?.textContent).toBe('Susan');
      expect(queryByTestId(testId9)?.firstChild?.textContent).toBe('Susan');
    } else {
      expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(1);
      expect(mixedComponentCounter.howManyTimesBeenCalled()).toBe(3);
      expect(testComponentCounter.howManyTimesBeenCalled()).toBe(6);
    }

    elementWithId = queryByTestId(testId11);
    expect(
      elementWithId && fireEvent.change(elementWithId, { target: { value: 'John' } })
    ).toBeTruthy();

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(queryByTestId(testId3)?.firstChild?.textContent).toBe('John');
      expect(queryByTestId(testId9)?.firstChild?.textContent).toBe('John');
    } else {
      expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(1);
      expect(mixedComponentCounter.howManyTimesBeenCalled()).toBe(4);
      expect(testComponentCounter.howManyTimesBeenCalled()).toBe(7);
    }

    elementWithId = queryByTestId(testId4);
    expect(
      elementWithId && fireEvent.change(elementWithId, { target: { value: 'Walmart' } })
    ).toBeTruthy();

    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(queryByTestId(testId7)?.firstChild?.textContent).toBe('Walmart');
    } else {
      expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(1);
      expect(mixedComponentCounter.howManyTimesBeenCalled()).toBe(4);
      expect(testComponentCounter.howManyTimesBeenCalled()).toBe(7);
    }

    cleanup();
    expect(() =>
      assertWrapper(() =>
        render(
          <Scope>
            <TestComponent
              defState={{
                storeName: undefined,
                storeLocation: () => undefined,
                [customerName]: () => undefined,
                [customerGender]: () => undefined,
              }}
            />
          </Scope>
        )
      )
    ).toThrow(/(useInterstate Error).*value never been set/);

    cleanup();
    expect(() =>
      assertWrapper(() =>
        render(
          <Scope>
            <TestComponent
              defState={{
                storeName: () => undefined,
                storeLocation: () => undefined,
                [customerName]: () => undefined,
                [customerGender]: 'male',
              }}
            />
          </Scope>
        )
      )
    ).toThrow(/(useInterstate Error).*concurrently during the same rendering cycle/);

    cleanup();
  },
];

export default testMultistateInterface;
