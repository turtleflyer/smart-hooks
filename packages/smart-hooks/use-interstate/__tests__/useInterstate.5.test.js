/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */
import React from 'react';
import { PropTypes } from 'prop-types';

const testContext = imports => () => {
  const {
    render, getLastMaps, CanListenAndUpdate, CanListen, ProvideScope,
  } = imports;

  const subscribeId1 = 1;
  const subscribeId2 = 2;
  const testId1 = 'first';
  const testId2 = 'second';
  const testId3 = 'third';
  const testId4 = 'forth';
  const testId5 = 'fifth';
  const testId6 = 'sixth';
  const countRender1 = jest.fn();
  const countRender2 = jest.fn();
  const countRender3 = jest.fn();
  const countRender4 = jest.fn();
  const countRender5 = jest.fn();
  const countRender6 = jest.fn();

  const IsolatedBlock = ({ initialValue, listenerId }) => (
    <>
      <CanListenAndUpdate
        {...{
          subscribeId: subscribeId1,
          testId: testId4,
          countRender: countRender4,
          initialValue,
        }}
      />
      <CanListenAndUpdate
        {...{
          subscribeId: subscribeId2,
          testId: testId5,
          countRender: countRender5,
        }}
      />
      <CanListen
        {...{
          subscribeId: listenerId,
          testId: testId6,
          countRender: countRender6,
        }}
      />
    </>
  );

  IsolatedBlock.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    initialValue: PropTypes.any,
    listenerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.symbol])
      .isRequired,
  };

  IsolatedBlock.defaultProps = {
    initialValue: undefined,
  };

  const TestComponent = ({ isolate, initialValue, listenerId }) => (
    <>
      <CanListenAndUpdate
        {...{
          subscribeId: subscribeId1,
          testId: testId1,
          countRender: countRender1,
        }}
      />
      <CanListenAndUpdate
        {...{
          subscribeId: subscribeId2,
          testId: testId2,
          countRender: countRender2,
        }}
      />
      <CanListen
        {...{
          subscribeId: listenerId,
          testId: testId3,
          countRender: countRender3,
        }}
      />
      {isolate ? (
        <ProvideScope>
          <IsolatedBlock {...{ initialValue, listenerId }} />
        </ProvideScope>
      ) : (
        <IsolatedBlock {...{ initialValue, listenerId }} />
      )}
    </>
  );

  TestComponent.propTypes = {
    isolate: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    initialValue: PropTypes.any,
    listenerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.symbol])
      .isRequired,
  };

  TestComponent.defaultProps = {
    initialValue: undefined,
    isolate: false,
  };

  const {
    fireNode, getTextFromNode, rerender, unmount,
  } = render(
    <TestComponent listenerId={subscribeId1} />,
  );
  const maps1 = getLastMaps();
  expect(maps1.map.get(subscribeId1).setters.length).toBe(4);
  expect(maps1.map.get(subscribeId2).setters.length).toBe(2);
  fireNode(testId1, 'bus');
  expect(getTextFromNode(testId1)).toBe('bus');
  expect(getTextFromNode(testId2)).toBe('');
  expect(getTextFromNode(testId3)).toBe('bus');
  expect(getTextFromNode(testId4)).toBe('bus');
  expect(getTextFromNode(testId5)).toBe('');
  expect(getTextFromNode(testId6)).toBe('bus');
  fireNode(testId4, 'car');
  expect(getTextFromNode(testId1)).toBe('car');
  expect(getTextFromNode(testId2)).toBe('');
  expect(getTextFromNode(testId3)).toBe('car');
  expect(getTextFromNode(testId4)).toBe('car');
  expect(getTextFromNode(testId5)).toBe('');
  expect(getTextFromNode(testId6)).toBe('car');
  fireNode(testId2, 'boat');
  expect(getTextFromNode(testId1)).toBe('car');
  expect(getTextFromNode(testId2)).toBe('boat');
  expect(getTextFromNode(testId3)).toBe('car');
  expect(getTextFromNode(testId4)).toBe('car');
  expect(getTextFromNode(testId5)).toBe('boat');
  expect(getTextFromNode(testId6)).toBe('car');
  expect(countRender1).toHaveBeenCalledTimes(3);
  expect(countRender2).toHaveBeenCalledTimes(2);
  expect(countRender3).toHaveBeenCalledTimes(3);
  expect(countRender4).toHaveBeenCalledTimes(3);
  expect(countRender5).toHaveBeenCalledTimes(2);
  expect(countRender6).toHaveBeenCalledTimes(3);

  rerender(<TestComponent isolate listenerId={subscribeId1} />);
  const maps2 = getLastMaps();
  expect(maps1.map.get(subscribeId1).setters.length).toBe(2);
  expect(maps1.map.get(subscribeId2).setters.length).toBe(1);
  expect(maps2.map.get(subscribeId1).setters.length).toBe(2);
  expect(maps2.map.get(subscribeId2).setters.length).toBe(1);
  fireNode(testId1, 'truck');
  expect(getTextFromNode(testId1)).toBe('truck');
  expect(getTextFromNode(testId2)).toBe('boat');
  expect(getTextFromNode(testId3)).toBe('truck');
  expect(getTextFromNode(testId4)).toBe('');
  expect(getTextFromNode(testId5)).toBe('');
  expect(getTextFromNode(testId6)).toBe('');
  fireNode(testId4, 'plane');
  expect(getTextFromNode(testId1)).toBe('truck');
  expect(getTextFromNode(testId2)).toBe('boat');
  expect(getTextFromNode(testId3)).toBe('truck');
  expect(getTextFromNode(testId4)).toBe('plane');
  expect(getTextFromNode(testId5)).toBe('');
  expect(getTextFromNode(testId6)).toBe('plane');
  expect(countRender1).toHaveBeenCalledTimes(5);
  expect(countRender2).toHaveBeenCalledTimes(3);
  expect(countRender3).toHaveBeenCalledTimes(5);
  expect(countRender4).toHaveBeenCalledTimes(5);
  expect(countRender5).toHaveBeenCalledTimes(3);
  expect(countRender6).toHaveBeenCalledTimes(5);

  rerender(<TestComponent listenerId={subscribeId2} />);
  expect(maps1.map.get(subscribeId1).setters.length).toBe(2);
  expect(maps1.map.get(subscribeId2).setters.length).toBe(4);
  expect(maps2.map.get(subscribeId1).setters.length).toBe(0);
  expect(maps2.map.get(subscribeId2).setters.length).toBe(0);
  expect(getTextFromNode(testId1)).toBe('truck');
  expect(getTextFromNode(testId2)).toBe('boat');
  expect(getTextFromNode(testId3)).toBe('boat');
  expect(getTextFromNode(testId4)).toBe('truck');
  expect(getTextFromNode(testId5)).toBe('boat');
  expect(getTextFromNode(testId6)).toBe('boat');
  expect(countRender1).toHaveBeenCalledTimes(6);
  expect(countRender2).toHaveBeenCalledTimes(4);
  expect(countRender3).toHaveBeenCalledTimes(6);
  expect(countRender4).toHaveBeenCalledTimes(6);
  expect(countRender5).toHaveBeenCalledTimes(4);
  expect(countRender6).toHaveBeenCalledTimes(6);

  rerender(<TestComponent isolate listenerId={subscribeId1} />);
  const maps3 = getLastMaps();
  expect(maps1.map.get(subscribeId1).setters.length).toBe(2);
  expect(maps1.map.get(subscribeId2).setters.length).toBe(1);
  expect(maps2.map.get(subscribeId1).setters.length).toBe(0);
  expect(maps2.map.get(subscribeId2).setters.length).toBe(0);
  expect(maps3.map.get(subscribeId1).setters.length).toBe(2);
  expect(maps3.map.get(subscribeId2).setters.length).toBe(1);
  expect(getTextFromNode(testId1)).toBe('truck');
  expect(getTextFromNode(testId2)).toBe('boat');
  expect(getTextFromNode(testId3)).toBe('truck');
  expect(getTextFromNode(testId4)).toBe('');
  expect(getTextFromNode(testId5)).toBe('');
  expect(getTextFromNode(testId6)).toBe('');
  expect(countRender1).toHaveBeenCalledTimes(7);
  expect(countRender2).toHaveBeenCalledTimes(5);
  expect(countRender3).toHaveBeenCalledTimes(7);
  expect(countRender4).toHaveBeenCalledTimes(7);
  expect(countRender5).toHaveBeenCalledTimes(5);
  expect(countRender6).toHaveBeenCalledTimes(7);

  rerender(<TestComponent listenerId={subscribeId1} initialValue="train" />);
  expect(maps1.map.get(subscribeId1).setters.length).toBe(4);
  expect(maps1.map.get(subscribeId2).setters.length).toBe(2);
  expect(maps2.map.get(subscribeId1).setters.length).toBe(0);
  expect(maps2.map.get(subscribeId2).setters.length).toBe(0);
  expect(maps3.map.get(subscribeId1).setters.length).toBe(0);
  expect(maps3.map.get(subscribeId2).setters.length).toBe(0);
  expect(getTextFromNode(testId1)).toBe('train');
  expect(getTextFromNode(testId2)).toBe('boat');
  expect(getTextFromNode(testId3)).toBe('train');
  expect(getTextFromNode(testId4)).toBe('train');
  expect(getTextFromNode(testId5)).toBe('boat');
  expect(getTextFromNode(testId6)).toBe('train');
  expect(countRender1).toHaveBeenCalledTimes(9);
  expect(countRender2).toHaveBeenCalledTimes(6);
  expect(countRender3).toHaveBeenCalledTimes(9);
  expect(countRender4).toHaveBeenCalledTimes(8);
  expect(countRender5).toHaveBeenCalledTimes(6);
  expect(countRender6).toHaveBeenCalledTimes(8);

  rerender(<TestComponent isolate listenerId={subscribeId2} initialValue="bike" />);
  const maps4 = getLastMaps();
  expect(maps1.map.get(subscribeId1).setters.length).toBe(1);
  expect(maps1.map.get(subscribeId2).setters.length).toBe(2);
  expect(maps2.map.get(subscribeId1).setters.length).toBe(0);
  expect(maps2.map.get(subscribeId2).setters.length).toBe(0);
  expect(maps3.map.get(subscribeId1).setters.length).toBe(0);
  expect(maps3.map.get(subscribeId2).setters.length).toBe(0);
  expect(maps4.map.get(subscribeId1).setters.length).toBe(1);
  expect(maps4.map.get(subscribeId2).setters.length).toBe(2);
  expect(getTextFromNode(testId1)).toBe('train');
  expect(getTextFromNode(testId2)).toBe('boat');
  expect(getTextFromNode(testId3)).toBe('boat');
  expect(getTextFromNode(testId4)).toBe('bike');
  expect(getTextFromNode(testId5)).toBe('');
  expect(getTextFromNode(testId6)).toBe('');
  expect(countRender1).toHaveBeenCalledTimes(10);
  expect(countRender2).toHaveBeenCalledTimes(7);
  expect(countRender3).toHaveBeenCalledTimes(10);
  expect(countRender4).toHaveBeenCalledTimes(9);
  expect(countRender5).toHaveBeenCalledTimes(7);
  expect(countRender6).toHaveBeenCalledTimes(9);

  unmount();
  expect(maps1.map.get(subscribeId1).setters.length).toBe(0);
  expect(maps1.map.get(subscribeId2).setters.length).toBe(0);
  expect(maps2.map.get(subscribeId1).setters.length).toBe(0);
  expect(maps2.map.get(subscribeId2).setters.length).toBe(0);
  expect(maps3.map.get(subscribeId1).setters.length).toBe(0);
  expect(maps3.map.get(subscribeId2).setters.length).toBe(0);
  expect(maps4.map.get(subscribeId1).setters.length).toBe(0);
  expect(maps4.map.get(subscribeId2).setters.length).toBe(0);
};

describe('Test useInterstate functionality for primary API', () => {
  const imports = {};

  beforeEach(() => {
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      Object.assign(imports, require('./prerequisite'), require('./testComponentPrimaryAPI'));
    });
  });

  test('ProvideScope works', testContext(imports));
});

describe('Test useInterstate functionality for secondary API', () => {
  const imports = {};

  beforeEach(() => {
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      Object.assign(imports, require('./prerequisite'), require('./testComponentSecondAPI'));
    });
  });

  test('ProvideScope works', testContext(imports));
});
