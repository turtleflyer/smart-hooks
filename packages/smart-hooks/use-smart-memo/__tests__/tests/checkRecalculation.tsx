import { render } from '@testing-library/react';
import { ExecutionCounter } from '@~internal/test-utilities/executionCounter';
import type { FC } from 'react';
import React from 'react';
import { TestDescription } from '../testsAssets';

const checkRecalculation: TestDescription = (p) => [
  'factory gets recalculated only when deps changed',
  () => {
    const {
      assets: { executionCountersFactory, wrapWithStrictModeComponent, useSmartMemo },
    } = p;

    const newFactory = (counter: ExecutionCounter) => () => {
      counter.count();
      return Math.random();
    };
    const counter1 = executionCountersFactory();
    const factory1 = newFactory(counter1);
    let value1!: number;
    const counter2 = executionCountersFactory();
    const factory2 = newFactory(counter2);
    let value2!: number;
    const counter3 = executionCountersFactory();
    const factory3 = newFactory(counter3);
    let value3!: number;
    const counter4 = executionCountersFactory();
    const factory4 = newFactory(counter4);
    let value4!: number;

    const TestComponent: FC<{
      param1: string;
      param2: string;
      param3: string;
    }> = wrapWithStrictModeComponent(({ param1, param2, param3 }) => {
      value1 = useSmartMemo(factory1, []);
      value2 = useSmartMemo(factory2, [param1]);
      value3 = useSmartMemo(factory3, [param1, param2]);
      value4 = useSmartMemo(factory4, [param1, param2, param3]);

      return <></>;
    });

    const { rerender, unmount } = render(
      <TestComponent param1="one" param2="two" param3="three" />
    );
    const firstCount2 = counter2.howManyTimesBeenCalled();
    const firstCount1 = counter1.howManyTimesBeenCalled();
    const firstCount3 = counter3.howManyTimesBeenCalled();
    const firstCount4 = counter4.howManyTimesBeenCalled();
    expect(value1).toBeDefined();
    expect(value2).toBeDefined();
    expect(value3).toBeDefined();
    expect(value4).toBeDefined();

    rerender(<TestComponent param1="more than one" param2="two" param3="three" />);
    expect(counter1.howManyTimesBeenCalled()).toBe(firstCount1);
    expect(counter2.howManyTimesBeenCalled()).toBe(firstCount2 + 1);
    expect(counter3.howManyTimesBeenCalled()).toBe(firstCount3 + 1);
    expect(counter4.howManyTimesBeenCalled()).toBe(firstCount4 + 1);

    rerender(<TestComponent param1="more than one" param2="two" param3="thirteen" />);
    expect(counter1.howManyTimesBeenCalled()).toBe(firstCount1);
    expect(counter2.howManyTimesBeenCalled()).toBe(firstCount2 + 1);
    expect(counter3.howManyTimesBeenCalled()).toBe(firstCount3 + 1);
    expect(counter4.howManyTimesBeenCalled()).toBe(firstCount4 + 2);

    rerender(<TestComponent param1="more than one" param2="how many?" param3="thirteen" />);
    expect(counter1.howManyTimesBeenCalled()).toBe(firstCount1);
    expect(counter2.howManyTimesBeenCalled()).toBe(firstCount2 + 1);
    expect(counter3.howManyTimesBeenCalled()).toBe(firstCount3 + 2);
    expect(counter4.howManyTimesBeenCalled()).toBe(firstCount4 + 3);

    unmount();
  },
];

export default checkRecalculation;
