import { fireEvent } from '@testing-library/react';
import type { FC } from 'react';
import React from 'react';
import type { TestDescription } from '../testsAssets';

const testEnhancedInterface: TestDescription = (p) => [
  'check enhanced interface of useInterstate',
  () => {
    const {
      assets: { render, getUseInterstate },
    } = p;

    const subscribeId0 = '0';
    const subscribeId1 = 1;
    interface BigState {
      [subscribeId0]: string;
      [subscribeId1]: string;
    }
    const { useInterstate } = getUseInterstate<BigState>();

    const testId0 = 'zero';
    const testId1 = 'first';
    const testId2 = 'second';
    const testId3 = 'third';

    const Update: FC = () => {
      const updateState = useInterstate(subscribeId0, '').set();

      return (
        <input
          {...{
            value: '',
            onChange: ({ target: { value } }) => updateState(value),
            'data-testid': testId0,
          }}
        />
      );
    };

    const TestComponent: FC = () => {
      const state0 = useInterstate(subscribeId0, '').get();
      const [state1, updateState1] = useInterstate(subscribeId1, '').both();

      return (
        <>
          <Update />
          <input
            {...{
              value: '',
              onChange: ({ target: { value } }) => updateState1(value),
              'data-testid': testId1,
            }}
          />
          <div {...{ 'data-testid': testId2 }}>{state0}</div>
          <div {...{ 'data-testid': testId3 }}>{state1}</div>
        </>
      );
    };

    const { unmount, getByTestId } = render(<TestComponent />);

    fireEvent.change(getByTestId(testId0), { target: { value: 'where are you' } });
    expect(getByTestId(testId2).childNodes[0].textContent).toBe('where are you');

    fireEvent.change(getByTestId(testId1), { target: { value: 'I am hearing' } });
    expect(getByTestId(testId3).childNodes[0].textContent).toBe('I am hearing');

    unmount();
  },
];

export default testEnhancedInterface;
