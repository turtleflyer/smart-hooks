import { render } from '@testing-library/react';
import React from 'react';
import { TestDescription } from '../testsAssets';

const edgeCases: TestDescription = (p) => [
  'check edge cases with undefined and 0 among dependencies array',
  () => {
    const {
      assets: { executionCountersFactory, wrapWithStrictModeComponent, useSmartMemo },
    } = p;

    const counter = executionCountersFactory();

    const TestComponent: React.FunctionComponent<{ params: any[] }> = wrapWithStrictModeComponent(
      ({ params }) => {
        useSmartMemo(() => {
          counter.count();
        }, params);

        return <></>;
      }
    );

    const { rerender, unmount } = render(<TestComponent params={[1, 0, 3]} />);
    const firstCount = counter.howManyTimesBeenCalled();

    rerender(<TestComponent params={[1, 0, 3]} />);
    expect(counter.howManyTimesBeenCalled()).toBe(firstCount);

    rerender(<TestComponent params={[1, 2, 3]} />);
    expect(counter.howManyTimesBeenCalled()).toBe(firstCount + 1);

    rerender(<TestComponent params={[1, undefined, 3]} />);
    expect(counter.howManyTimesBeenCalled()).toBe(firstCount + 2);

    rerender(<TestComponent params={[1, 0, 3]} />);
    expect(counter.howManyTimesBeenCalled()).toBe(firstCount + 3);

    rerender(<TestComponent params={[1, undefined, 3]} />);
    expect(counter.howManyTimesBeenCalled()).toBe(firstCount + 4);

    rerender(<TestComponent params={[1, undefined, 3]} />);
    expect(counter.howManyTimesBeenCalled()).toBe(firstCount + 4);

    rerender(<TestComponent params={[1, 2, 3]} />);
    expect(counter.howManyTimesBeenCalled()).toBe(firstCount + 5);

    rerender(<TestComponent params={[1, 0, 3]} />);
    expect(counter.howManyTimesBeenCalled()).toBe(firstCount + 6);

    unmount();
  },
];

export default edgeCases;
