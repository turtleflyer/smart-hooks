/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */

import React from 'react';

describe('Test useInterstate functionality', () => {
  let render;
  let CanListen;
  let CanUpdate;
  let CanListenAndUpdate;

  beforeEach(() => {
    jest.isolateModules(() => {
      ({
        render,
        // eslint-disable-next-line global-require
      } = require('./prerequisite'));

      ({
        CanListen,
        CanUpdate,
        CanListenAndUpdate,
        // eslint-disable-next-line global-require
      } = require('./testComponentGeneralAPI'));
    });
  });

  test('check initialization concurrency', () => {
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
  });

  test('values remain after tree unmount', () => {
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
  });
});
