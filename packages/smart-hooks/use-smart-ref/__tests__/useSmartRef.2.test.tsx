/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */
import { render } from '@testing-library/react';
import React, { useRef } from 'react';
import { useSmartRef as useSmartRefT } from '../useSmartRef';
import { Counter as CounterT } from './prerequisite';

describe('Test useSmartRef functionality', () => {
  let useSmartRef: typeof useSmartRefT;
  let Counter: typeof CounterT;

  beforeEach(() => {
    jest.isolateModules(() => {
      ({ useSmartRef } = require('../useSmartRef.ts'));
      ({ Counter } = require('./prerequisite.ts'));
    });
  });

  test('use smartRef without optional ref parameter and returned cleaning function',
    () => {
      let recordElement: HTMLDivElement | undefined | null;
      const TestComponent = ({ dataKey }: { dataKey: string }) => {
        const ref = useSmartRef((el: HTMLDivElement | null) => { recordElement = el; });
        return (
          <div data-key={dataKey} ref={ref} />
        );
      };

      const { rerender, unmount } = render(<TestComponent dataKey='Baltimore' />);
      expect(recordElement && recordElement.getAttribute('data-key')).toBe('Baltimore');

      rerender(<TestComponent dataKey='Los Angeles' />);
      expect(recordElement && recordElement.getAttribute('data-key')).toBe('Los Angeles');

      unmount();
    });
});
