import React from 'react';
import type { FC } from 'react';
import type { SetInterstate } from '../../src/useInterstate';
import type { TestDescription } from '../testsAssets';

const testSettersImmutability: TestDescription = (p) => [
  'test setters are immutable',
  () => {
    const {
      assets: { render, useInterstate, wrapWithStrictModeComponent },
    } = p;
    const subscribeId1 = '1';
    const subscribeId2 = '2';
    let memSetter!: SetInterstate<string>;

    const TestComponent: FC<{
      subscribeId: string;
      initValue: string;
    }> = wrapWithStrictModeComponent(({ subscribeId, initValue }) => {
      [, memSetter] = useInterstate(subscribeId, initValue);
      return <></>;
    });

    const { rerender, unmount } = render(
      <TestComponent subscribeId={subscribeId1} initValue="air" />
    );
    const memSetterFirst = memSetter;

    rerender(<TestComponent subscribeId={subscribeId1} initValue="water" />);
    expect(memSetter).toBe(memSetterFirst);

    rerender(<TestComponent subscribeId={subscribeId2} initValue="earth" />);
    expect(memSetter).toBe(memSetterFirst);

    unmount();
  },
];

export default testSettersImmutability;
