import React from 'react';
import { TestDescription } from '../testsAssets';

const rerenderWithInitValueResetState: TestDescription = (p) => [
  'rerendering with init value resets state to this value',
  () => {
    const {
      assets: { render, CanListen, CanUpdate },
    } = p;
    const subscribeId1 = '1';
    const subscribeId2 = '2';
    const testId1 = 'updater';
    const testId2 = 'listener';

    const TestComponent: React.FunctionComponent<{
      init?: string | null;
      id?: string;
    }> = ({ init, id = subscribeId1 }) => (
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

    const { rerender, fireNode, getTextFromNode, unmount } = render(<TestComponent init="start" />);
    expect(getTextFromNode(testId2)).toBe('start');

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
  },
];

export default rerenderWithInitValueResetState;
