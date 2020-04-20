import React from 'react';
import { TestDescription } from '../testsAssets';
import { flagManager } from '../testFlags';

const testContext: TestDescription = p => [
  'Scope component works',
  () => {
    const {
      assets: {
        render,
        getLastMap,
        Scope,
        executionCountersFactory,
        CanListen,
        CanListenAndUpdate,
      },
    } = p;

    const subscribeId1 = 1;
    const subscribeId2 = 2;
    const testId1 = 'first';
    const testId2 = 'second';
    const testId3 = 'third';
    const testId4 = 'forth';
    const testId5 = 'fifth';
    const testId6 = 'sixth';
    const countRender1 = executionCountersFactory();
    const countRender2 = executionCountersFactory();
    const countRender3 = executionCountersFactory();
    const countRender4 = executionCountersFactory();
    const countRender5 = executionCountersFactory();
    const countRender6 = executionCountersFactory();

    const IsolatedBlock = ({
      initialValue,
      listenerId,
    }: {
      initialValue?: string;
      listenerId: number;
    }) => (
      <>
        <CanListenAndUpdate
          {...{
            subscribeId: subscribeId1,
            testId: testId4,
            countRender: countRender4.count,
            initialValue,
          }}
        />
        <CanListenAndUpdate
          {...{
            subscribeId: subscribeId2,
            testId: testId5,
            countRender: countRender5.count,
          }}
        />
        <CanListen
          {...{
            subscribeId: listenerId,
            testId: testId6,
            countRender: countRender6.count,
          }}
        />
      </>
    );

    const TestComponent = ({
      isolate = false,
      initialValue,
      listenerId,
    }: {
      isolate?: boolean;
      initialValue?: string;
      listenerId: number;
    }) => (
      <>
        <CanListenAndUpdate
          {...{
            subscribeId: subscribeId1,
            testId: testId1,
            countRender: countRender1.count,
          }}
        />
        <CanListenAndUpdate
          {...{
            subscribeId: subscribeId2,
            testId: testId2,
            countRender: countRender2.count,
          }}
        />
        <CanListen
          {...{
            subscribeId: listenerId,
            testId: testId3,
            countRender: countRender3.count,
          }}
        />
        {isolate ? (
          <Scope>
            <IsolatedBlock {...{ initialValue, listenerId }} />
          </Scope>
        ) : (
          <IsolatedBlock {...{ initialValue, listenerId }} />
        )}
      </>
    );

    const { fireNode, getTextFromNode, rerender, unmount } = render(
      <TestComponent listenerId={subscribeId1} />
    );
    const map1 = getLastMap();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(
        (map1.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(4);
      expect(
        (map1.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(2);
    }
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
    expect(countRender1.howManyTimesBeenCalled()).toBe(3);
    expect(countRender2.howManyTimesBeenCalled()).toBe(2);
    expect(countRender3.howManyTimesBeenCalled()).toBe(3);
    expect(countRender4.howManyTimesBeenCalled()).toBe(3);
    expect(countRender5.howManyTimesBeenCalled()).toBe(2);
    expect(countRender6.howManyTimesBeenCalled()).toBe(3);

    rerender(<TestComponent isolate={true} listenerId={subscribeId1} />);
    const map2 = getLastMap();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(
        (map1.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(2);
      expect(
        (map1.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(1);
      expect(
        (map2.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(2);
      expect(
        (map2.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(1);
    }
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
    expect(countRender1.howManyTimesBeenCalled()).toBe(5);
    expect(countRender2.howManyTimesBeenCalled()).toBe(3);
    expect(countRender3.howManyTimesBeenCalled()).toBe(5);
    expect(countRender4.howManyTimesBeenCalled()).toBe(5);
    expect(countRender5.howManyTimesBeenCalled()).toBe(3);
    expect(countRender6.howManyTimesBeenCalled()).toBe(5);

    rerender(<TestComponent listenerId={subscribeId2} />);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(
        (map1.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(2);
      expect(
        (map1.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(4);
      expect(
        (map2.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map2.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(0);
    }
    expect(getTextFromNode(testId1)).toBe('truck');
    expect(getTextFromNode(testId2)).toBe('boat');
    expect(getTextFromNode(testId3)).toBe('boat');
    expect(getTextFromNode(testId4)).toBe('truck');
    expect(getTextFromNode(testId5)).toBe('boat');
    expect(getTextFromNode(testId6)).toBe('boat');
    expect(countRender1.howManyTimesBeenCalled()).toBe(6);
    expect(countRender2.howManyTimesBeenCalled()).toBe(4);
    expect(countRender3.howManyTimesBeenCalled()).toBe(6);
    expect(countRender4.howManyTimesBeenCalled()).toBe(6);
    expect(countRender5.howManyTimesBeenCalled()).toBe(4);
    expect(countRender6.howManyTimesBeenCalled()).toBe(6);

    rerender(<TestComponent isolate={true} listenerId={subscribeId1} />);
    const map3 = getLastMap();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(
        (map1.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(2);
      expect(
        (map1.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(1);
      expect(
        (map2.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map2.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map3.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(2);
      expect(
        (map3.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(1);
    }
    expect(getTextFromNode(testId1)).toBe('truck');
    expect(getTextFromNode(testId2)).toBe('boat');
    expect(getTextFromNode(testId3)).toBe('truck');
    expect(getTextFromNode(testId4)).toBe('');
    expect(getTextFromNode(testId5)).toBe('');
    expect(getTextFromNode(testId6)).toBe('');
    expect(countRender1.howManyTimesBeenCalled()).toBe(7);
    expect(countRender2.howManyTimesBeenCalled()).toBe(5);
    expect(countRender3.howManyTimesBeenCalled()).toBe(7);
    expect(countRender4.howManyTimesBeenCalled()).toBe(7);
    expect(countRender5.howManyTimesBeenCalled()).toBe(5);
    expect(countRender6.howManyTimesBeenCalled()).toBe(7);

    rerender(<TestComponent listenerId={subscribeId1} initialValue="train" />);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(
        (map1.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(4);
      expect(
        (map1.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(2);
      expect(
        (map2.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map2.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map3.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map3.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(0);
    }
    expect(getTextFromNode(testId1)).toBe('train');
    expect(getTextFromNode(testId2)).toBe('boat');
    expect(getTextFromNode(testId3)).toBe('train');
    expect(getTextFromNode(testId4)).toBe('train');
    expect(getTextFromNode(testId5)).toBe('boat');
    expect(getTextFromNode(testId6)).toBe('train');
    expect(countRender1.howManyTimesBeenCalled()).toBe(9);
    expect(countRender2.howManyTimesBeenCalled()).toBe(6);
    expect(countRender3.howManyTimesBeenCalled()).toBe(9);
    expect(countRender4.howManyTimesBeenCalled()).toBe(8);
    expect(countRender5.howManyTimesBeenCalled()).toBe(6);
    expect(countRender6.howManyTimesBeenCalled()).toBe(9);

    rerender(
      <TestComponent
        isolate={true}
        listenerId={subscribeId2}
        initialValue="bike"
      />
    );
    const map4 = getLastMap();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(
        (map1.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(1);
      expect(
        (map1.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(2);
      expect(
        (map2.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map2.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map3.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map3.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map4.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(1);
      expect(
        (map4.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(2);
    }
    expect(getTextFromNode(testId1)).toBe('train');
    expect(getTextFromNode(testId2)).toBe('boat');
    expect(getTextFromNode(testId3)).toBe('boat');
    expect(getTextFromNode(testId4)).toBe('bike');
    expect(getTextFromNode(testId5)).toBe('');
    expect(getTextFromNode(testId6)).toBe('');
    expect(countRender1.howManyTimesBeenCalled()).toBe(10);
    expect(countRender2.howManyTimesBeenCalled()).toBe(7);
    expect(countRender3.howManyTimesBeenCalled()).toBe(10);
    expect(countRender4.howManyTimesBeenCalled()).toBe(9);
    expect(countRender5.howManyTimesBeenCalled()).toBe(7);
    expect(countRender6.howManyTimesBeenCalled()).toBe(10);

    unmount();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(
        (map1.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map1.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map2.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map2.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map3.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map3.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map4.get(subscribeId1) as { setters: any[] }).setters.length
      ).toBe(0);
      expect(
        (map4.get(subscribeId2) as { setters: any[] }).setters.length
      ).toBe(0);
    }
  },
];

export default testContext;
