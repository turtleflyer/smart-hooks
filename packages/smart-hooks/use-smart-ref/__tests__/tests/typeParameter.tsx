/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { render } from '@testing-library/react';
import React, { useRef } from 'react';
import type { FC } from 'react';
import { TestDescription } from '../testsAssets';

const typeParameter: TestDescription = (p) => [
  'type parameter for useSmartRef works correctly',
  () => {
    const {
      assets: { wrapWithStrictModeComponent, useSmartRef },
    } = p;

    const TestComponent: FC = wrapWithStrictModeComponent(() => {
      const commonElementRef = useRef();
      const anchorElementRef = useRef<HTMLAnchorElement>();
      const divRefCallback = useSmartRef(() => {
        // placeholder function
      }, commonElementRef);
      const anchorRefCallback = useSmartRef(() => {
        // placeholder function
      }, anchorElementRef);
      const commonRefCallback = useSmartRef(() => {
        // placeholder function
      }, commonElementRef);
      return (
        <>
          <div ref={divRefCallback} />
          <a ref={anchorRefCallback} />
          <span ref={commonRefCallback} />
        </>
      );
    });

    const { unmount } = render(<TestComponent />);

    unmount();
  },
];

export default typeParameter;
