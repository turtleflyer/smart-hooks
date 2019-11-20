import React from 'react';
import { TestDescription, ComposeCallback } from '../testsAssets';

const sophisticatedStructure: TestDescription = (
  p,
  createTestComponents,
  shouldTestPerformance,
) => [
  'sophisticated structure can communicate',
  () => {
    const {
      assets: { render, getLastMap },
    } = p;
    const { CanListen, CanUpdate, CanListenAndUpdate } = createTestComponents(p);
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
    const altComposeCallback: ComposeCallback = set => ({ target: { value } }) => {
      set((old: string) => (old || '') + value);
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
            countRender: countRender1,
            subscribeId: subscribeId1,
            testId: testId1,
          }}
        >
          <CanListenAndUpdate
            {...{
              subscribeId: subscribeId2,
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
                composeCallback: altComposeCallback,
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
                  composeCallback: altComposeCallback,
                  testId: testId6,
                  countRender: countRender6,
                }}
              >
                <CanListenAndUpdate
                  {...{
                    subscribeId: subscribeId2,
                    composeCallback: altComposeCallback,
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
    expect(getTextFromNode(testId2)).toBe('j');
    expect(getTextFromNode(testId5)).toBe('j');
    expect(getTextFromNode(testId7)).toBe('j');
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
    expect(getTextFromNode(testId1)).toBe('o');
    expect(getTextFromNode(testId3)).toBe('o');
    expect(getTextFromNode(testId4)).toBe('o');
    expect(getTextFromNode(testId8)).toBe('o');
    expect(getTextFromNode(testId9)).toBe('o');
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
    expect(getTextFromNode(testId2)).toBe('jz');
    expect(getTextFromNode(testId5)).toBe('jz');
    expect(getTextFromNode(testId7)).toBe('jz');
    expect(countRender1).toHaveBeenCalledTimes(3);
    expect(countRender2).toHaveBeenCalledTimes(3);
    expect(countRender3).toHaveBeenCalledTimes(3);
    expect(countRender4).toHaveBeenCalledTimes(3);
    expect(countRender5).toHaveBeenCalledTimes(3);
    expect(countRender6).toHaveBeenCalledTimes(1);
    expect(countRender7).toHaveBeenCalledTimes(3);
    expect(countRender8).toHaveBeenCalledTimes(3);
    expect(countRender9).toHaveBeenCalledTimes(3);
    if (shouldTestPerformance) {
      expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(5);
      expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(3);
    }

    unmount();
    if (shouldTestPerformance) {
      expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(0);
      expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(0);
    }
  },
];

export default sophisticatedStructure;
