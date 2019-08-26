/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */

import React from 'react';
import { PropTypes } from 'prop-types';

const typeCheck = imports => () => {
  const { render, CanListenAndUpdate } = imports;

  const TestComponent = ({ id }) => (
    <CanListenAndUpdate
      {...{
        subscribeId: id,
      }}
    />
  );

  TestComponent.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    id: PropTypes.any.isRequired,
  };

  let rerender;
  let unmount;

  expect(() => {
    ({ rerender, unmount } = render(<TestComponent id={365} />));
  }).not.toThrow();

  expect(() => {
    rerender(<TestComponent id="high" />);
  }).not.toThrow();

  expect(() => {
    rerender(<TestComponent id={Symbol('Pink Floyd')} />);
  }).not.toThrow();

  expect(() => {
    rerender(<TestComponent id={{ foo: 'not me' }} />);
  }).toThrow(/Subscription/);

  expect(() => {
    rerender(<TestComponent id={() => null} />);
  }).toThrow(/Subscription/);

  unmount();
};

describe('Test useInterstate functionality for primary API', () => {
  const imports = {};

  beforeEach(() => {
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      Object.assign(imports, require('./prerequisite'), require('./testComponentPrimaryAPI'));
    });
    jest.spyOn(console, 'error');
    console.error.mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('allows id to be of certain type', typeCheck(imports));
});

describe('Test useInterstate functionality for secondary API', () => {
  const imports = {};

  beforeEach(() => {
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      Object.assign(imports, require('./prerequisite'), require('./testComponentPrimaryAPI'));
    });
    jest.spyOn(console, 'error');
    console.error.mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('allows id to be of certain type', typeCheck(imports));
});
