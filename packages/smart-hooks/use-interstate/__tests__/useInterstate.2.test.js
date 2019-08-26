/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */

import React from 'react';
import { PropTypes } from 'prop-types';

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
        }}
      />
      <CanListen
        {...{
          subscribeId,
          testId: testId2,
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

const rerenderWithInitValueResetState = imports => () => {
  const { render, CanListen, CanUpdate } = imports;
  const subscribeId1 = '1';
  const subscribeId2 = '2';
  const testId1 = 'updater';
  const testId2 = 'listener';

  const TestComponent = ({ init, id }) => (
    <>
      <CanUpdate
        {...{
          subscribeId: id,
          testId: testId1,
        }}
      />
      {init !== null && (
        <CanListen
          {...{
            subscribeId: id,
            testId: testId2,
            initialValue: init,
          }}
        />
      )}
    </>
  );

  TestComponent.propTypes = {
    init: PropTypes.string,
    id: PropTypes.string,
  };

  TestComponent.defaultProps = {
    init: undefined,
    id: subscribeId1,
  };

  const {
    rerender, fireNode, getTextFromNode, unmount,
  } = render(<TestComponent />);
  expect(getTextFromNode(testId2)).toBe('');
  fireNode(testId1, 'good');
  expect(getTextFromNode(testId2)).toBe('good');
  rerender(<TestComponent init={null} />);
  rerender(<TestComponent init="bad" />);
  expect(getTextFromNode(testId2)).toBe('bad');
  fireNode(testId1, 'fair');
  expect(getTextFromNode(testId2)).toBe('fair');
  rerender(<TestComponent />);
  expect(getTextFromNode(testId2)).toBe('fair');
  rerender(<TestComponent init="ugly" id={subscribeId2} />);
  expect(getTextFromNode(testId2)).toBe('ugly');
  rerender(<TestComponent init="fun" id={subscribeId2} />);
  expect(getTextFromNode(testId2)).toBe('ugly');
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

  test(
    'rerendering with init value reset state to this value',
    rerenderWithInitValueResetState(imports),
  );
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

  test(
    'rerendering with init value reset state to this value',
    rerenderWithInitValueResetState(imports),
  );
});
