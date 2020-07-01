import { render } from '@testing-library/react';
import React from 'react';
import type { CallbackRef } from '../../src/useSmartRef';
import type { TestDescription } from '../testsAssets';

const testCallbackRefImmutability: TestDescription = (p) => [
  'test callback ref is immutable',
  () => {
    const {
      assets: { useSmartRef, wrapWithStrictModeComponent },
    } = p;
    let memCallback!: CallbackRef;

    const TestComponent: React.FunctionComponent<{
      effect: () => void;
    }> = wrapWithStrictModeComponent(({ effect }) => {
      memCallback = useSmartRef(effect);
      return <></>;
    });

    const { rerender, unmount } = render(<TestComponent effect={() => {}} />);
    const memCallbackFirst = memCallback;

    rerender(<TestComponent effect={() => {}} />);
    expect(memCallback).toBe(memCallbackFirst);

    unmount();
  },
];

export default testCallbackRefImmutability;
