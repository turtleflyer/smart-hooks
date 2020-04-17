import React from 'react';
import { TestDescription, ComposeCallback } from '../testsAssets';
import { flagManager } from '../testFlags';

const sophisticatedStructure: TestDescription = p => [
  'sophisticated structure can communicate',
  () => {
    const {
      assets: {
        render,
        getLastMap,
        executionCountersFactory,
        CanListen,
        CanUpdate,
        CanListenAndUpdate,
      },
    } = p;
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
    const altComposeCallback: ComposeCallback = set => ({
      target: { value },
    }) => {
      set((old: string) => (old || '') + value);
    };
    const countRender1 = executionCountersFactory();
    const countRender2 = executionCountersFactory();
    const countRender3 = executionCountersFactory();
    const countRender4 = executionCountersFactory();
    const countRender5 = executionCountersFactory();
    const countRender6 = executionCountersFactory();
    const countRender7 = executionCountersFactory();
    const countRender8 = executionCountersFactory();
    const countRender9 = executionCountersFactory();
    const TestComponent = () => (
      <>
        <CanListen
          {...{
            subscribeId: subscribeId1,
            testId: testId1,
            countRender: countRender1.count,
          }}
        >
          <CanListenAndUpdate
            {...{
              subscribeId: subscribeId2,
              testId: testId2,
              countRender: countRender2.count,
            }}
          />
        </CanListen>
        <div>
          <CanListen
            {...{
              subscribeId: subscribeId1,
              testId: testId3,
              countRender: countRender3.count,
            }}
          />
          <div>
            <CanListenAndUpdate
              {...{
                subscribeId: subscribeId1,
                composeCallback: altComposeCallback,
                testId: testId4,
                countRender: countRender4.count,
              }}
            />
            <CanListen
              {...{
                subscribeId: subscribeId2,
                testId: testId5,
                countRender: countRender5.count,
              }}
            />
            <div>
              <CanUpdate
                {...{
                  subscribeId: subscribeId2,
                  composeCallback: altComposeCallback,
                  testId: testId6,
                  countRender: countRender6.count,
                }}
              >
                <CanListenAndUpdate
                  {...{
                    subscribeId: subscribeId2,
                    composeCallback: altComposeCallback,
                    testId: testId7,
                    countRender: countRender7.count,
                  }}
                />
              </CanUpdate>
              <CanListen
                {...{
                  subscribeId: subscribeId1,
                  testId: testId8,
                  countRender: countRender8.count,
                }}
              >
                <div>
                  <CanListenAndUpdate
                    {...{
                      subscribeId: subscribeId1,
                      testId: testId9,
                      countRender: countRender9.count,
                    }}
                  />
                </div>
              </CanListen>
            </div>
          </div>
        </div>
      </>
    );

    const { unmount, fireNode, getTextFromNode } = render(<TestComponent />);
    const map = getLastMap();
    expect(getTextFromNode(testId1)).toBe('');
    expect(getTextFromNode(testId2)).toBe('');

    fireNode(testId4, 'i');
    expect(getTextFromNode(testId1)).toBe('i');
    expect(getTextFromNode(testId3)).toBe('i');
    expect(getTextFromNode(testId4)).toBe('i');
    expect(getTextFromNode(testId8)).toBe('i');
    expect(getTextFromNode(testId9)).toBe('i');
    expect(countRender1.howManyTimesBeenCalled()).toBe(2);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(2);
    expect(countRender4.howManyTimesBeenCalled()).toBe(2);
    expect(countRender5.howManyTimesBeenCalled()).toBe(1);
    expect(countRender6.howManyTimesBeenCalled()).toBe(1);
    expect(countRender7.howManyTimesBeenCalled()).toBe(1);
    expect(countRender8.howManyTimesBeenCalled()).toBe(2);
    expect(countRender9.howManyTimesBeenCalled()).toBe(2);

    fireNode(testId2, 'j');
    expect(getTextFromNode(testId2)).toBe('j');
    expect(getTextFromNode(testId5)).toBe('j');
    expect(getTextFromNode(testId7)).toBe('j');
    expect(countRender1.howManyTimesBeenCalled()).toBe(2);
    expect(countRender2.howManyTimesBeenCalled()).toBe(2);
    expect(countRender3.howManyTimesBeenCalled()).toBe(2);
    expect(countRender4.howManyTimesBeenCalled()).toBe(2);
    expect(countRender5.howManyTimesBeenCalled()).toBe(2);
    expect(countRender6.howManyTimesBeenCalled()).toBe(1);
    expect(countRender7.howManyTimesBeenCalled()).toBe(2);
    expect(countRender8.howManyTimesBeenCalled()).toBe(2);
    expect(countRender9.howManyTimesBeenCalled()).toBe(2);

    fireNode(testId9, 'o');
    expect(getTextFromNode(testId1)).toBe('o');
    expect(getTextFromNode(testId3)).toBe('o');
    expect(getTextFromNode(testId4)).toBe('o');
    expect(getTextFromNode(testId8)).toBe('o');
    expect(getTextFromNode(testId9)).toBe('o');
    expect(countRender1.howManyTimesBeenCalled()).toBe(3);
    expect(countRender2.howManyTimesBeenCalled()).toBe(2);
    expect(countRender3.howManyTimesBeenCalled()).toBe(3);
    expect(countRender4.howManyTimesBeenCalled()).toBe(3);
    expect(countRender5.howManyTimesBeenCalled()).toBe(2);
    expect(countRender6.howManyTimesBeenCalled()).toBe(1);
    expect(countRender7.howManyTimesBeenCalled()).toBe(2);
    expect(countRender8.howManyTimesBeenCalled()).toBe(3);
    expect(countRender9.howManyTimesBeenCalled()).toBe(3);

    fireNode(testId7, 'z');
    expect(getTextFromNode(testId2)).toBe('jz');
    expect(getTextFromNode(testId5)).toBe('jz');
    expect(getTextFromNode(testId7)).toBe('jz');
    expect(countRender1.howManyTimesBeenCalled()).toBe(3);
    expect(countRender2.howManyTimesBeenCalled()).toBe(3);
    expect(countRender3.howManyTimesBeenCalled()).toBe(3);
    expect(countRender4.howManyTimesBeenCalled()).toBe(3);
    expect(countRender5.howManyTimesBeenCalled()).toBe(3);
    expect(countRender6.howManyTimesBeenCalled()).toBe(1);
    expect(countRender7.howManyTimesBeenCalled()).toBe(3);
    expect(countRender8.howManyTimesBeenCalled()).toBe(3);
    expect(countRender9.howManyTimesBeenCalled()).toBe(3);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(
        5
      );
      expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(
        3
      );
    }

    unmount();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(
        0
      );
      expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(
        0
      );
    }
  },
];

export default sophisticatedStructure;
