/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */

import {
  React,
  render,
  getLastMaps,
  CanListen,
  CanUpdate,
  CanListenAndUpdate,
} from './prerequisite ';

describe('Test useInterstate functionality', () => {
  let maps;

  afterEach(() => {
    if (maps) {
      maps.map.clear();
    }
  });

  test('siblings can communicate', () => {
    const subscribeId = '1';
    const testId1 = 'updater';
    const testId2 = 'listener';
    const composeCallback = set => ({ target: { value } }) => {
      set(value);
    };
    const countRender1 = jest.fn();
    const countRender2 = jest.fn();
    const TestComponent = () => (
      <>
        <CanUpdate
          {...{
            subscribeId,
            composeCallback,
            testId: testId1,
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

    const { unmount, fireNode, getNodeWithText } = render(<TestComponent />);
    maps = getLastMaps();
    expect(getNodeWithText(testId2)).toHaveTextContent('');
    fireNode(testId1, 'n');
    expect(getNodeWithText(testId2)).toHaveTextContent('n');
    expect(countRender1).toHaveBeenCalledTimes(1);
    expect(countRender2).toHaveBeenCalledTimes(2);
    expect(maps.map.get(subscribeId).setters.length).toBe(1);
    unmount();
    expect(maps.map.get(subscribeId).setters.length).toBe(0);
  });

  test('sophisticated structure can communicate', () => {
    const subscribeId1 = '1';
    const subscribeId2 = '2';
    const testId1 = 'first';
    const testId2 = 'second';
    const testId3 = 'third';
    const testId4 = 'forth';
    const testId5 = 'fifth';
    const testId6 = 'sixth';
    const testId7 = 'seventh';
    const testId8 = 'eighth';
    const testId9 = 'ninth';
    const composeCallback1 = set => ({ target: { value } }) => {
      set(value);
    };
    const composeCallback2 = set => ({ target: { value } }) => {
      set(old => (old || '') + value);
    };
    const countRender1 = jest.fn();
    const countRender2 = jest.fn();
    const countRender3 = jest.fn();
    const countRender4 = jest.fn();
    const countRender5 = jest.fn();
    const countRender6 = jest.fn();
    const countRender7 = jest.fn();
    const countRender8 = jest.fn();
    const countRender9 = jest.fn();
    const TestComponent = () => (
      <>
        <CanListen
          {...{
            subscribeId: subscribeId1,
            testId: testId1,
            countRender: countRender1,
          }}
        >
          <CanListenAndUpdate
            {...{
              subscribeId: subscribeId2,
              composeCallback: composeCallback1,
              testId: testId2,
              countRender: countRender2,
            }}
          />
        </CanListen>
        <div>
          <CanListen
            {...{
              subscribeId: subscribeId1,
              testId: testId3,
              countRender: countRender3,
            }}
          />
          <div>
            <CanListenAndUpdate
              {...{
                subscribeId: subscribeId1,
                composeCallback: composeCallback2,
                testId: testId4,
                countRender: countRender4,
              }}
            />
            <CanListen
              {...{
                subscribeId: subscribeId2,
                testId: testId5,
                countRender: countRender5,
              }}
            />
            <div>
              <CanUpdate
                {...{
                  subscribeId: subscribeId2,
                  composeCallback: composeCallback2,
                  testId: testId6,
                  countRender: countRender6,
                }}
              >
                <CanListenAndUpdate
                  {...{
                    subscribeId: subscribeId2,
                    composeCallback: composeCallback2,
                    testId: testId7,
                    countRender: countRender7,
                  }}
                />
              </CanUpdate>
              <CanListen
                {...{
                  subscribeId: subscribeId1,
                  testId: testId8,
                  countRender: countRender8,
                }}
              >
                <div>
                  <CanListenAndUpdate
                    {...{
                      subscribeId: subscribeId1,
                      composeCallback: composeCallback1,
                      testId: testId9,
                      countRender: countRender9,
                    }}
                  />
                </div>
              </CanListen>
            </div>
          </div>
        </div>
      </>
    );

    const { unmount, fireNode, getNodeWithText } = render(<TestComponent />);
    maps = getLastMaps();
    expect(getNodeWithText(testId1)).toHaveTextContent('');
    expect(getNodeWithText(testId2)).toHaveTextContent('');
    fireNode(testId4, 'i');
    expect(getNodeWithText(testId1)).toHaveTextContent('i');
    expect(getNodeWithText(testId3)).toHaveTextContent('i');
    expect(getNodeWithText(testId4)).toHaveTextContent('i');
    expect(getNodeWithText(testId8)).toHaveTextContent('i');
    expect(getNodeWithText(testId9)).toHaveTextContent('i');
    expect(countRender1).toHaveBeenCalledTimes(2);
    expect(countRender2).toHaveBeenCalledTimes(1);
    expect(countRender3).toHaveBeenCalledTimes(2);
    expect(countRender4).toHaveBeenCalledTimes(2);
    expect(countRender5).toHaveBeenCalledTimes(1);
    expect(countRender6).toHaveBeenCalledTimes(1);
    expect(countRender7).toHaveBeenCalledTimes(1);
    expect(countRender8).toHaveBeenCalledTimes(2);
    expect(countRender9).toHaveBeenCalledTimes(2);
    fireNode(testId2, 'j');
    expect(getNodeWithText(testId2)).toHaveTextContent('j');
    expect(getNodeWithText(testId5)).toHaveTextContent('j');
    expect(getNodeWithText(testId7)).toHaveTextContent('j');
    expect(countRender1).toHaveBeenCalledTimes(2);
    expect(countRender2).toHaveBeenCalledTimes(2);
    expect(countRender3).toHaveBeenCalledTimes(2);
    expect(countRender4).toHaveBeenCalledTimes(2);
    expect(countRender5).toHaveBeenCalledTimes(2);
    expect(countRender6).toHaveBeenCalledTimes(1);
    expect(countRender7).toHaveBeenCalledTimes(2);
    expect(countRender8).toHaveBeenCalledTimes(2);
    expect(countRender9).toHaveBeenCalledTimes(2);
    fireNode(testId9, 'o');
    expect(getNodeWithText(testId1)).toHaveTextContent('o');
    expect(getNodeWithText(testId3)).toHaveTextContent('o');
    expect(getNodeWithText(testId4)).toHaveTextContent('o');
    expect(getNodeWithText(testId8)).toHaveTextContent('o');
    expect(getNodeWithText(testId9)).toHaveTextContent('o');
    expect(countRender1).toHaveBeenCalledTimes(3);
    expect(countRender2).toHaveBeenCalledTimes(2);
    expect(countRender3).toHaveBeenCalledTimes(3);
    expect(countRender4).toHaveBeenCalledTimes(3);
    expect(countRender5).toHaveBeenCalledTimes(2);
    expect(countRender6).toHaveBeenCalledTimes(1);
    expect(countRender7).toHaveBeenCalledTimes(2);
    expect(countRender8).toHaveBeenCalledTimes(3);
    expect(countRender9).toHaveBeenCalledTimes(3);
    fireNode(testId7, 'z');
    expect(getNodeWithText(testId2)).toHaveTextContent('jz');
    expect(getNodeWithText(testId5)).toHaveTextContent('jz');
    expect(getNodeWithText(testId7)).toHaveTextContent('jz');
    expect(countRender1).toHaveBeenCalledTimes(3);
    expect(countRender2).toHaveBeenCalledTimes(3);
    expect(countRender3).toHaveBeenCalledTimes(3);
    expect(countRender4).toHaveBeenCalledTimes(3);
    expect(countRender5).toHaveBeenCalledTimes(3);
    expect(countRender6).toHaveBeenCalledTimes(1);
    expect(countRender7).toHaveBeenCalledTimes(3);
    expect(countRender8).toHaveBeenCalledTimes(3);
    expect(countRender9).toHaveBeenCalledTimes(3);
    expect(maps.map.get(subscribeId1).setters.length).toBe(5);
    expect(maps.map.get(subscribeId2).setters.length).toBe(3);
    unmount();
    expect(maps.map.get(subscribeId1).setters.length).toBe(0);
    expect(maps.map.get(subscribeId2).setters.length).toBe(0);
  });
});
