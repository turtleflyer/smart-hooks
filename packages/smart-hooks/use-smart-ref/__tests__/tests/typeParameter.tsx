import { render } from '@testing-library/react';
import React, { useRef } from 'react';
import { TestDescription } from '../testsAssets';

const typeParameter: TestDescription = p => [
  'type parameter for useSmartRef works correctly',
  () => {
    const {
      assets: { useSmartRef },
    } = p;
    const TestComponent = () => {
      const commonElementRef = useRef();
      const spanElementRef = useRef<HTMLSpanElement>();
      const divRefCallback = useSmartRef((el: HTMLDivElement) => {},
      commonElementRef);
      const spanRefCallback = useSmartRef<HTMLSpanElement>(() => {},
      spanElementRef);
      const commonRefCallback = useSmartRef(() => {}, spanElementRef);
      return (
        <>
          <div ref={divRefCallback} />
          <span ref={spanRefCallback} />
          <a ref={commonRefCallback} />
        </>
      );
    };

    const { unmount } = render(<TestComponent />);

    unmount();
  },
];

export default typeParameter;
