import { render } from '@testing-library/react';
import React, { useRef } from 'react';
import { TestDescription } from '../testsAssets';

const typeParameter: TestDescription = (p) => [
  'type parameter for useSmartRef works correctly',
  () => {
    const {
      assets: { wrapWithStrictModeComponent, useSmartRef },
    } = p;

    const TestComponent: React.FunctionComponent = wrapWithStrictModeComponent(() => {
      const commonElementRef = useRef();
      const anchorElementRef = useRef<HTMLAnchorElement>();
      const divRefCallback = useSmartRef((el: HTMLDivElement) => {}, commonElementRef);
      const anchorRefCallback = useSmartRef(() => {}, anchorElementRef);
      const commonRefCallback = useSmartRef(() => {}, commonElementRef);
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
