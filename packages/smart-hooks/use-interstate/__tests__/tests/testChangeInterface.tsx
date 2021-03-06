import type { RenderResult } from '@testing-library/react';
import { cleanup } from '@testing-library/react';
import type { FC, ReactElement } from 'react';
import React from 'react';
import type {
  InterstateInitializeObject, InterstateInitializeParam,
  StateKey
} from '../../src/useInterstate';
import type { TestDescription } from '../testsAssets';

const testChangeInterface: TestDescription = (p) => [
  'changing interface must cause an error',
  () => {
    const {
      assets: { render, createAssertWrapper, useInterstate, wrapWithStrictModeComponent },
    } = p;

    const [assertWrapper] = createAssertWrapper();
    const testId = '1';

    type Args =
      | [StateKey, InterstateInitializeParam<unknown>]
      | [InterstateInitializeObject<object>];

    const TestComponent: FC<{
      args: Args;
      keyToRead: string | number;
    }> = wrapWithStrictModeComponent(({ args, keyToRead }) => {
      useInterstate(...(args as [never, never]));
      const [useSubscribeToKey] = useInterstate<string | number | boolean>(keyToRead);
      const stateOfKey = useSubscribeToKey();

      return <div data-testid={testId}>{stateOfKey.toString()}</div>;
    });

    let rerender: (ui: ReactElement) => void;
    let unmount: () => boolean;
    let getByTestId: RenderResult['getByTestId'];

    ({ rerender, getByTestId } = render(<TestComponent args={[1, 'low']} keyToRead={1} />));
    expect(getByTestId(testId)?.textContent).toBe('low');

    rerender(<TestComponent args={[2, 'high']} keyToRead={2} />);
    expect(getByTestId(testId)?.textContent).toBe('high');

    expect(() =>
      assertWrapper(() => rerender(<TestComponent args={[{ 1: 'low' }]} keyToRead={1} />))
    ).toThrow(/(useInterstate Error).*Invalid attempt to change of using interface/);
    cleanup();

    ({ rerender, getByTestId } = render(
      <TestComponent args={[{ true: false }]} keyToRead="true" />
    ));
    expect(getByTestId(testId).textContent).toBe('false');

    expect(() =>
      assertWrapper(() =>
        rerender(<TestComponent args={[{ true: false, false: true }]} keyToRead="false" />)
      )
    ).toThrow(/(useInterstate Error).*value never been set/);
    cleanup();

    // eslint-disable-next-line prefer-const
    ({ rerender, getByTestId, unmount } = render(
      <TestComponent args={[{ country: 'UK' }]} keyToRead="country" />
    ));
    expect(getByTestId(testId).textContent).toBe('UK');

    rerender(
      <TestComponent
        args={[{ city: 'Long Beach', neighborhood: 'Rose Park' }]}
        keyToRead="country"
      />
    );
    expect(getByTestId(testId).textContent).toBe('UK');

    expect(() =>
      assertWrapper(() => rerender(<TestComponent args={['animal', 'cat']} keyToRead={1} />))
    ).toThrow(/(useInterstate Error).*Invalid attempt to change of using interface/);
    cleanup();

    unmount();
  },
];

export default testChangeInterface;
