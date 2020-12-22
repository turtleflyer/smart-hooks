import { fireEvent, render } from '@testing-library/react';
import type { ExecutionCounter } from '@~internal/test-utilities/executionCounter';
import type { FC } from 'react';
import React, { createContext, useContext, useEffect } from 'react';
import type { SettersObject } from '../../src/useMultiState';
import type { TestDescription } from '../testsAssets';

const testSophisticatedCase: TestDescription = (p) => [
  'test sophisticated case of using useMultiState',
  () => {
    const {
      assets: { executionCountersFactory, wrapWithStrictModeComponent, useMultiState },
    } = p;

    const storeProviderCounter = executionCountersFactory();
    const storeComponentCounter = executionCountersFactory();
    const customerComponentCounter = executionCountersFactory();
    const testComponentCounter = executionCountersFactory();

    function useCounter(counter: ExecutionCounter) {
      useEffect(() => counter.count());
    }

    const testId0 = 'store-name';
    const testId1 = 'store-location';
    const testId2 = 'store-name-input';
    const testId3 = 'store-location-input';
    const testId4 = 'customer-name';
    const testId5 = 'customer-gender';
    const testId6 = 'customer-name-input';
    const testId7 = 'customer-gender-input';
    const testId8 = 'item-type';
    const testId9 = 'item-size';
    const testId10 = 'item-type-input';
    const testId11 = 'item-size-input';

    type OnlyStringsInProperties = Record<number | string | symbol, string | undefined>;

    interface ItemState {
      readonly type: string | undefined;
      readonly size: string | undefined;
    }

    interface StoreState {
      readonly name: string | undefined;
      readonly location: string | undefined;
    }

    const customerName = Symbol('customer name');
    const customerGender = Symbol('customer gender');

    interface CustomerState {
      readonly [customerName]: string | undefined;
      readonly [customerGender]: string | undefined;
    }

    const defItemState: ItemState = { type: undefined, size: undefined };

    const defStoreState: StoreState = { name: undefined, location: undefined };

    const defCustomerState: CustomerState = {
      [customerName]: undefined,
      [customerGender]: undefined,
    };

    type InputFormProps<S extends OnlyStringsInProperties, P extends keyof S> = {
      labelText: string;
      dataTestId: string;
      setters: SettersObject<S>;
      keyOfState: P;
    };

    type InputFormComponent = <S extends OnlyStringsInProperties, P extends keyof S>(
      arg: InputFormProps<S, P>
    ) => ReturnType<FC<InputFormProps<S, P>>>;

    const InputForm: InputFormComponent = <S extends OnlyStringsInProperties, P extends keyof S>({
      labelText,
      dataTestId,
      setters,
      keyOfState,
    }: InputFormProps<S, P>) => (
      <form>
        <label>{labelText}</label>
        <input
          data-testid={dataTestId}
          type="text"
          onChange={(e) =>
            (setters as SettersObject<OnlyStringsInProperties>)[keyOfState](e.target.value)
          }
        />
      </form>
    );

    const DisplayPieceOfState: FC<{
      pieceOfState: string | undefined;
      dataTestId: string;
    }> = ({ pieceOfState, dataTestId }) => (
      <div data-testid={dataTestId}>{pieceOfState ?? 'N/A'}</div>
    );

    const StoreContext = createContext<[StoreState, SettersObject<StoreState>]>(undefined as never);

    const StoreProvider: FC = ({ children }) => {
      const toProvide = useMultiState(defStoreState);
      useCounter(storeProviderCounter);

      return <StoreContext.Provider value={toProvide}>{children}</StoreContext.Provider>;
    };

    const Store: FC = () => {
      const [storeState, setStoreState] = useContext(StoreContext);
      useCounter(storeComponentCounter);

      return (
        <>
          <DisplayPieceOfState pieceOfState={storeState.name} dataTestId={testId0} />
          <DisplayPieceOfState pieceOfState={storeState.location} dataTestId={testId1} />
          <InputForm
            labelText="Input store name"
            dataTestId={testId2}
            setters={setStoreState}
            keyOfState="name"
          />
          <InputForm
            labelText="Input store location"
            dataTestId={testId3}
            setters={setStoreState}
            keyOfState="location"
          />
        </>
      );
    };

    const Customer: FC<{
      customerState: CustomerState;
      setCustomerState: SettersObject<CustomerState>;
    }> = ({ customerState, setCustomerState }) => {
      useCounter(customerComponentCounter);

      return (
        <>
          <DisplayPieceOfState pieceOfState={customerState[customerName]} dataTestId={testId4} />
          <DisplayPieceOfState pieceOfState={customerState[customerGender]} dataTestId={testId5} />
          <InputForm
            labelText="Input customer name"
            dataTestId={testId6}
            setters={setCustomerState}
            keyOfState={customerName}
          />
          <InputForm
            labelText="Input customer gender"
            dataTestId={testId7}
            setters={setCustomerState}
            keyOfState={customerGender}
          />
        </>
      );
    };

    const TestComponent: FC = wrapWithStrictModeComponent(() => {
      const [itemState, setItemState] = useMultiState(defItemState);
      const [customerState, setCustomerState] = useMultiState(defCustomerState);
      useCounter(testComponentCounter);

      return (
        <>
          <StoreProvider>
            <Store />
          </StoreProvider>
          <Customer {...{ customerState, setCustomerState }} />
          <DisplayPieceOfState pieceOfState={itemState.type} dataTestId={testId8} />
          <DisplayPieceOfState pieceOfState={itemState.size} dataTestId={testId9} />
          <InputForm
            labelText="Input item type"
            dataTestId={testId10}
            setters={setItemState}
            keyOfState="type"
          />
          <InputForm
            labelText="Input item size"
            dataTestId={testId11}
            setters={setItemState}
            keyOfState="size"
          />
        </>
      );
    });

    const { unmount, queryByTestId } = render(<TestComponent />);

    expect(queryByTestId(testId0)?.firstChild?.textContent).toBe('N/A');
    expect(queryByTestId(testId1)?.firstChild?.textContent).toBe('N/A');
    expect(queryByTestId(testId4)?.firstChild?.textContent).toBe('N/A');
    expect(queryByTestId(testId5)?.firstChild?.textContent).toBe('N/A');
    expect(queryByTestId(testId8)?.firstChild?.textContent).toBe('N/A');
    expect(queryByTestId(testId9)?.firstChild?.textContent).toBe('N/A');
    expect(storeProviderCounter.howManyTimesBeenCalled()).toBe(1);
    expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(1);
    expect(customerComponentCounter.howManyTimesBeenCalled()).toBe(1);
    expect(testComponentCounter.howManyTimesBeenCalled()).toBe(1);

    let elementWithId = queryByTestId(testId2);
    expect(
      elementWithId && fireEvent.change(elementWithId, { target: { value: 'Walmart' } })
    ).toBeTruthy();

    expect(queryByTestId(testId0)?.firstChild?.textContent).toBe('Walmart');
    expect(storeProviderCounter.howManyTimesBeenCalled()).toBe(2);
    expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(2);
    expect(customerComponentCounter.howManyTimesBeenCalled()).toBe(1);
    expect(testComponentCounter.howManyTimesBeenCalled()).toBe(1);

    elementWithId = queryByTestId(testId3);
    expect(
      elementWithId && fireEvent.change(elementWithId, { target: { value: 'North Pole' } })
    ).toBeTruthy();

    expect(queryByTestId(testId1)?.firstChild?.textContent).toBe('North Pole');
    expect(storeProviderCounter.howManyTimesBeenCalled()).toBe(3);
    expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(3);
    expect(customerComponentCounter.howManyTimesBeenCalled()).toBe(1);
    expect(testComponentCounter.howManyTimesBeenCalled()).toBe(1);

    elementWithId = queryByTestId(testId6);
    expect(
      elementWithId && fireEvent.change(elementWithId, { target: { value: 'Teddy Bear' } })
    ).toBeTruthy();

    expect(queryByTestId(testId4)?.firstChild?.textContent).toBe('Teddy Bear');
    expect(storeProviderCounter.howManyTimesBeenCalled()).toBe(4);
    expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(4);
    expect(customerComponentCounter.howManyTimesBeenCalled()).toBe(2);
    expect(testComponentCounter.howManyTimesBeenCalled()).toBe(2);

    elementWithId = queryByTestId(testId7);
    expect(
      elementWithId && fireEvent.change(elementWithId, { target: { value: 'male' } })
    ).toBeTruthy();

    expect(queryByTestId(testId5)?.firstChild?.textContent).toBe('male');
    expect(storeProviderCounter.howManyTimesBeenCalled()).toBe(5);
    expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(5);
    expect(customerComponentCounter.howManyTimesBeenCalled()).toBe(3);
    expect(testComponentCounter.howManyTimesBeenCalled()).toBe(3);

    elementWithId = queryByTestId(testId10);
    expect(
      elementWithId && fireEvent.change(elementWithId, { target: { value: 'gloves' } })
    ).toBeTruthy();

    expect(queryByTestId(testId8)?.firstChild?.textContent).toBe('gloves');
    expect(storeProviderCounter.howManyTimesBeenCalled()).toBe(6);
    expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(6);
    expect(customerComponentCounter.howManyTimesBeenCalled()).toBe(4);
    expect(testComponentCounter.howManyTimesBeenCalled()).toBe(4);

    elementWithId = queryByTestId(testId11);
    expect(
      elementWithId && fireEvent.change(elementWithId, { target: { value: 'XL' } })
    ).toBeTruthy();

    expect(queryByTestId(testId9)?.firstChild?.textContent).toBe('XL');
    expect(storeProviderCounter.howManyTimesBeenCalled()).toBe(7);
    expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(7);
    expect(customerComponentCounter.howManyTimesBeenCalled()).toBe(5);
    expect(testComponentCounter.howManyTimesBeenCalled()).toBe(5);

    unmount();
  },
];

export default testSophisticatedCase;
