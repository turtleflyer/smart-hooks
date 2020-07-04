import { fireEvent, render } from '@testing-library/react';
import React, { createContext, useContext, useEffect } from 'react';
import type { ExecutionCounter } from '../../../../../test_utilities/executionCounter';
import type { SettersObject } from '../../src/useMultistate';
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

    type ItemState = {
      readonly type: string | undefined;
      readonly size: string | undefined;
    };

    type StoreState = {
      readonly name: string | undefined;
      readonly location: string | undefined;
    };

    const customerName = Symbol('customer name');
    const customerGender = Symbol('customer gender');

    type CustomerState = {
      readonly [customerName]: string | undefined;
      readonly [customerGender]: string | undefined;
    };

    const defItemState: ItemState = { type: undefined, size: undefined };

    const defStoreState: StoreState = { name: undefined, location: undefined };

    const defCustomerState: CustomerState = {
      [customerName]: undefined,
      [customerGender]: undefined,
    };

    type OnlyStringsInProperties = {
      [P in number | string | symbol]: string | undefined;
    };

    type InputFormProps<S extends object> = S extends OnlyStringsInProperties
      ? {
          labelText: string;
          dataTestId: string;
          setters: SettersObject<S>;
          keyOfState: keyof S;
        }
      : never;

    type InputFormComponent = <S extends object>(
      arg: InputFormProps<S>
    ) => ReturnType<React.FunctionComponent<InputFormProps<S>>>;

    const InputForm: InputFormComponent = <S extends object>({
      labelText,
      dataTestId,
      setters,
      keyOfState,
    }: InputFormProps<S>) => (
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

    const StoreContext = createContext<[StoreState, SettersObject<StoreState>] | undefined>(
      undefined
    );

    const StoreProvider: React.FunctionComponent = ({ children }) => {
      const toProvide = useMultiState(defStoreState);
      useCounter(storeProviderCounter);

      return <StoreContext.Provider value={toProvide}>{children}</StoreContext.Provider>;
    };

    const Store: React.FunctionComponent = () => {
      const [storeState, setStoreState] = useContext(StoreContext)!;
      useCounter(storeComponentCounter);

      return (
        <>
          <div data-testid={testId0}>{storeState.name ?? 'N/A'}</div>
          <div data-testid={testId1}>{storeState.location ?? 'N/A'}</div>
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

    const Customer: React.FunctionComponent<{
      customerState: CustomerState;
      setCustomerState: SettersObject<CustomerState>;
    }> = ({ customerState, setCustomerState }) => {
      useCounter(customerComponentCounter);

      return (
        <>
          <div data-testid={testId4}>{customerState[customerName] ?? 'N/A'}</div>
          <div data-testid={testId5}>{customerState[customerGender] ?? 'N/A'}</div>
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

    const TestComponent: React.FunctionComponent = wrapWithStrictModeComponent(() => {
      const [itemState, setItemState] = useMultiState(defItemState);
      const [customerState, setCustomerState] = useMultiState(defCustomerState);
      useCounter(testComponentCounter);

      return (
        <>
          <StoreProvider>
            <Store />
          </StoreProvider>
          <Customer {...{ customerState, setCustomerState }} />
          <div data-testid={testId8}>{itemState.type ?? 'N/A'}</div>
          <div data-testid={testId9}>{itemState.size ?? 'N/A'}</div>
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

    expect(
      fireEvent.change(queryByTestId(testId2)!, { target: { value: 'Walmart' } })
    ).toBeTruthy();

    expect(queryByTestId(testId0)?.firstChild?.textContent).toBe('Walmart');
    expect(storeProviderCounter.howManyTimesBeenCalled()).toBe(2);
    expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(2);
    expect(customerComponentCounter.howManyTimesBeenCalled()).toBe(1);
    expect(testComponentCounter.howManyTimesBeenCalled()).toBe(1);

    expect(
      fireEvent.change(queryByTestId(testId3)!, { target: { value: 'North Pole' } })
    ).toBeTruthy();

    expect(queryByTestId(testId1)?.firstChild?.textContent).toBe('North Pole');
    expect(storeProviderCounter.howManyTimesBeenCalled()).toBe(3);
    expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(3);
    expect(customerComponentCounter.howManyTimesBeenCalled()).toBe(1);
    expect(testComponentCounter.howManyTimesBeenCalled()).toBe(1);

    expect(
      fireEvent.change(queryByTestId(testId6)!, { target: { value: 'Teddy Bear' } })
    ).toBeTruthy();

    expect(queryByTestId(testId4)?.firstChild?.textContent).toBe('Teddy Bear');
    expect(storeProviderCounter.howManyTimesBeenCalled()).toBe(4);
    expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(4);
    expect(customerComponentCounter.howManyTimesBeenCalled()).toBe(2);
    expect(testComponentCounter.howManyTimesBeenCalled()).toBe(2);

    expect(fireEvent.change(queryByTestId(testId7)!, { target: { value: 'male' } })).toBeTruthy();

    expect(queryByTestId(testId5)?.firstChild?.textContent).toBe('male');
    expect(storeProviderCounter.howManyTimesBeenCalled()).toBe(5);
    expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(5);
    expect(customerComponentCounter.howManyTimesBeenCalled()).toBe(3);
    expect(testComponentCounter.howManyTimesBeenCalled()).toBe(3);

    expect(
      fireEvent.change(queryByTestId(testId10)!, { target: { value: 'gloves' } })
    ).toBeTruthy();

    expect(queryByTestId(testId8)?.firstChild?.textContent).toBe('gloves');
    expect(storeProviderCounter.howManyTimesBeenCalled()).toBe(6);
    expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(6);
    expect(customerComponentCounter.howManyTimesBeenCalled()).toBe(4);
    expect(testComponentCounter.howManyTimesBeenCalled()).toBe(4);

    expect(fireEvent.change(queryByTestId(testId11)!, { target: { value: 'XL' } })).toBeTruthy();

    expect(queryByTestId(testId9)?.firstChild?.textContent).toBe('XL');
    expect(storeProviderCounter.howManyTimesBeenCalled()).toBe(7);
    expect(storeComponentCounter.howManyTimesBeenCalled()).toBe(7);
    expect(customerComponentCounter.howManyTimesBeenCalled()).toBe(5);
    expect(testComponentCounter.howManyTimesBeenCalled()).toBe(5);

    unmount();
  },
];

export default testSophisticatedCase;
