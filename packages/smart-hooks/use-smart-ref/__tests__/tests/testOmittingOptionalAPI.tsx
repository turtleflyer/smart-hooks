import { render } from '@testing-library/react';
import React from 'react';
import { TestDescription } from '../testsAssets';

const testOmittingOptionalAPI: TestDescription = p => [
  'use smartRef without optional ref parameter when it returns cleaning function',
  () => {
    const {
      assets: { useSmartRef },
    } = p;
    let recordElement: HTMLDivElement | undefined | null;
    const TestComponent = ({ dataKey }: { dataKey: string }) => {
      const ref = useSmartRef((el: HTMLDivElement) => {
        recordElement = el;
      });
      return <div data-key={dataKey} ref={ref} />;
    };

    const { rerender, unmount } = render(<TestComponent dataKey="Baltimore" />);
    expect(recordElement && recordElement.getAttribute('data-key')).toBe(
      'Baltimore',
    );

    rerender(<TestComponent dataKey="Los Angeles" />);
    expect(recordElement && recordElement.getAttribute('data-key')).toBe(
      'Los Angeles',
    );

    unmount();
  },
];

export default testOmittingOptionalAPI;
