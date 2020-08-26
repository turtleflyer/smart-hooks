import { render } from '@testing-library/react';
import React from 'react';
import type { FC } from 'react';
import type { CallbackRef } from '../../src/useSmartRef';
import type { TestDescription } from '../testsAssets';

const testCallbackRefImmutability: TestDescription = (p) => [
  'test callback ref is immutable',
  () => {
    const {
      assets: { useSmartRef, wrapWithStrictModeComponent },
    } = p;
    let memCallback!: CallbackRef;

    const TestComponent: FC<{
      effect?: () => void;
    }> = wrapWithStrictModeComponent(
      ({
        effect = () => {
          // placeholder function
        },
      }) => {
        memCallback = useSmartRef(effect);
        return <></>;
      }
    );

    const { rerender, unmount } = render(<TestComponent />);
    const memCallbackFirst = memCallback;

    rerender(
      <TestComponent
        {...{
          effect() {
            // new instance of placeholder function
          },
        }}
      />
    );
    expect(memCallback).toBe(memCallbackFirst);

    unmount();
  },
];

export default testCallbackRefImmutability;
