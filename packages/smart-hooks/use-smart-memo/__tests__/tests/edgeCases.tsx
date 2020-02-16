import { render } from '@testing-library/react';
import React from 'react';
import { TestDescription } from '../testsAssets';

const edgeCases: TestDescription = p => [
  'check edge cases with undefined and 0 among dependencies array',
  () => {
    const {
      assets: { executionCountersFactory, useSmartMemo },
    } = p;

    const counter = executionCountersFactory();
    let mainCounter = 0;

    const TestComponent = ({ params }: { params: any[] }) => {
      mainCounter++;
      useSmartMemo(() => {
        counter.count();
      }, params);

      return <></>;
    };

    const { rerender, unmount } = render(<TestComponent params={[1, 0, 3]} />);
    expect(mainCounter).toBe(1);
    expect(counter.howManyTimesBeenCalled()).toBe(1);

    rerender(<TestComponent params={[1, 0, 3]} />);
    expect(mainCounter).toBe(2);
    expect(counter.howManyTimesBeenCalled()).toBe(1);

    rerender(<TestComponent params={[1, 2, 3]} />);
    expect(mainCounter).toBe(3);
    expect(counter.howManyTimesBeenCalled()).toBe(2);

    rerender(<TestComponent params={[1, undefined, 3]} />);
    expect(mainCounter).toBe(4);
    expect(counter.howManyTimesBeenCalled()).toBe(3);

    rerender(<TestComponent params={[1, 0, 3]} />);
    expect(mainCounter).toBe(5);
    expect(counter.howManyTimesBeenCalled()).toBe(4);

    rerender(<TestComponent params={[1, undefined, 3]} />);
    expect(mainCounter).toBe(6);
    expect(counter.howManyTimesBeenCalled()).toBe(5);

    rerender(<TestComponent params={[1, undefined, 3]} />);
    expect(mainCounter).toBe(7);
    expect(counter.howManyTimesBeenCalled()).toBe(5);

    rerender(<TestComponent params={[1, 2, 3]} />);
    expect(mainCounter).toBe(8);
    expect(counter.howManyTimesBeenCalled()).toBe(6);

    rerender(<TestComponent params={[1, 0, 3]} />);
    expect(mainCounter).toBe(9);
    expect(counter.howManyTimesBeenCalled()).toBe(7);

    unmount();
  },
];

export default edgeCases;
