/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */

import React from 'react';

const checkInitializationConcurrency = imports => () => {
  const {
    render, CanListen, CanUpdate, CanListenAndUpdate,
  } = imports;
  const subscribeId = '1';
  const testId = 'first';

  const InnerComponent = () => (
    <div>
      <CanListen
        {...{
          subscribeId,
          initialValue: 'b',
        }}
      />
    </div>
  );

  const TestComponent = () => (
    <>
      <div>
        <div>
          <CanUpdate
            {...{
              subscribeId,
              initialValue: 'a',
            }}
          />
          <InnerComponent />
        </div>
      </div>
      <CanListenAndUpdate
        {...{
          subscribeId,
          testId,
          initialValue: 'c',
        }}
      />
    </>
  );

  const { unmount, getTextFromNode } = render(<TestComponent />);
  expect(getTextFromNode(testId)).toBe('c');
  unmount();
};

const valuesRemainAfterTreeUnmount = imports => () => {
  const { render, CanListen, CanUpdate } = imports;
  const subscribeId = '1';
  const testId1 = 'updater';
  const testId2 = 'listener';
  const countRender1 = jest.fn();
  const countRender2 = jest.fn();
  const altComposeCallback = set => ({ target: { value } }) => {
    set(old => (old || '') + value);
  };
  const TestComponent = () => (
    <>
      <CanUpdate
        {...{
          subscribeId,
          testId: testId1,
          composeCallback: altComposeCallback,
          countRender: countRender1,
        }}
      />
      <CanListen
        {...{
          subscribeId,
          testId: testId2,
          countRender: countRender2,
        }}
      />
    </>
  );

  const {
    unmount, rerender, fireNode, getTextFromNode,
  } = render(<TestComponent />);
  expect(getTextFromNode(testId2)).toBe('');
  fireNode(testId1, 'g');
  fireNode(testId1, 'e');
  expect(getTextFromNode(testId2)).toBe('ge');
  unmount();
  rerender(<TestComponent />);
  expect(getTextFromNode(testId2)).toBe('ge');
  fireNode(testId1, 'f');
  fireNode(testId1, 'r');
  expect(getTextFromNode(testId2)).toBe('gefr');
  unmount();
};

describe('Test useInterstate functionality for primary API', () => {
  const imports = {};

  beforeEach(() => {
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      Object.assign(imports, require('./prerequisite'), require('./testComponentPrimaryAPI'));
    });
  });

  test('check initialization concurrency', checkInitializationConcurrency(imports));

  test('values remain after tree unmount', valuesRemainAfterTreeUnmount(imports));
});

describe('Test useInterstate functionality for secondary API', () => {
  const imports = {};

  beforeEach(() => {
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      Object.assign(imports, require('./prerequisite'), require('./testComponentSecondAPI'));
    });
  });

  test('check initialization concurrency', checkInitializationConcurrency(imports));

  test('values remain after tree unmount', valuesRemainAfterTreeUnmount(imports));
});
