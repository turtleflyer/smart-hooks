import { render } from '@testing-library/react';
import React from 'react';
import { TestDescription } from '../testsAssets';

const generalFunctionality: TestDescription = p => [
  'general functionality of useMemo is supported',
  () => {
    const {
      assets: { executionCountersFactory, useSmartMemo },
    } = p;

    const counter1 = executionCountersFactory();
    const counter2 = executionCountersFactory();

    let value1!: number;
    let value2!: number;

    const TestComponent = ({
      param1,
      param2,
    }: {
      param1: number;
      param2: number;
    }) => {
      value1 = useSmartMemo(() => {
        counter1.count();
        return param1;
      }, [param1]);

      value2 = useSmartMemo(() => {
        counter2.count();
        return param2;
      }, [param1]);

      return <></>;
    };

    const { rerender, unmount } = render(
      <TestComponent param1={1} param2={2} />,
    );
    expect(counter1.howManyTimesBeenCalled()).toBe(1);
    expect(counter2.howManyTimesBeenCalled()).toBe(1);
    expect(value1).toBe(1);
    expect(value2).toBe(2);

    rerender(<TestComponent param1={10} param2={20} />);
    expect(counter1.howManyTimesBeenCalled()).toBe(2);
    expect(counter2.howManyTimesBeenCalled()).toBe(2);
    expect(value1).toBe(10);
    expect(value2).toBe(20);

    rerender(<TestComponent param1={11} param2={20} />);
    expect(counter1.howManyTimesBeenCalled()).toBe(3);
    expect(counter2.howManyTimesBeenCalled()).toBe(3);
    expect(value1).toBe(11);
    expect(value2).toBe(20);

    rerender(<TestComponent param1={11} param2={22} />);
    expect(counter1.howManyTimesBeenCalled()).toBe(3);
    expect(counter2.howManyTimesBeenCalled()).toBe(3);
    expect(value1).toBe(11);
    expect(value2).toBe(20);

    unmount();
  },
];

export default generalFunctionality;
