/* eslint-env jest */

import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ValueConductor, useStateReceiptor } from '../reactTestTools';

describe('Test useStateReceiptor', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test('rendered right', () => {
    const stateReceiptor = new ValueConductor();

    const TestComponent = () => {
      const state = useStateReceiptor(stateReceiptor, 'one');

      return <div>{state}</div>;
    };

    act(() => {
      ReactDOM.render(<TestComponent />, container);
    });

    expect(container.innerHTML).toBe('<div>one</div>');

    act(() => {
      stateReceiptor('two');
    });

    expect(container.innerHTML).toBe('<div>two</div>');
  });
});
