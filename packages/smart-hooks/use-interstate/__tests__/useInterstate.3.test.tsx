import React, { useCallback, useState } from 'react';
import { PrerequisiteImport } from './prerequisite';
import { APIImport } from './testComponentPrimaryAPI';

interface PrimaryAPIMergedImport extends PrerequisiteImport, APIImport {}

const dynamicSubscriptionWorks = (imports: PrimaryAPIMergedImport) => () => {
  const { render, getLastMap, CanListen, CanUpdate, CanListenAndUpdate, fireEvent } = imports;

  const subscribeId1 = '1';
  const subscribeId2 = '2';
  const testId1 = 'first';
  const testId2 = 'second';
  const testId3 = 'third';
  const testId4 = 'forth';
  const testId5 = 'fifth';
  const countRender1 = jest.fn();
  const countRender2 = jest.fn();
  const countRender3 = jest.fn();
  const countRender4 = jest.fn();

  const Dynamic = () => {
    const [subscribeId, setSubscribeId] = useState('1');
    const [initialValue, setInitialValue] = useState();

    const scenario = useCallback(({ target: { value } }) => {
      switch (value) {
        case '1':
          setSubscribeId(subscribeId1);
          setInitialValue(undefined);
          break;

        case '2':
          setSubscribeId(subscribeId2);
          break;

        case '3':
          setSubscribeId(subscribeId1);
          setInitialValue('mars');
          break;

        case '4':
          setInitialValue('neptune');
          break;

        default:
          break;
      }
    }, []);

    return (
      <>
        <CanListenAndUpdate
          {...{
            testId: testId4,
            countRender: countRender4,
            subscribeId,
            initialValue,
          }}
        />
        <input value="" onChange={scenario} data-testid={testId5} />
      </>
    );
  };

  const TestComponent = () => (
    <>
      <CanListen
        {...{
          subscribeId: subscribeId1,
          testId: testId1,
          countRender: countRender1,
        }}
      >
        <CanUpdate
          {...{
            subscribeId: subscribeId1,
            testId: testId2,
            countRender: countRender2,
            initialValue: 'sun',
          }}
        />
        <CanUpdate
          {...{
            subscribeId: subscribeId2,
            testId: testId3,
            countRender: countRender3,
            initialValue: 'moon',
          }}
        />
      </CanListen>
      <Dynamic />
    </>
  );

  const { fireNode, getTextFromNode, getByTestId, unmount } = render(<TestComponent />);
  const map = getLastMap();
  expect(getTextFromNode(testId1)).toBe('sun');
  expect(getTextFromNode(testId4)).toBe('sun');
  fireNode(testId1, 'venus');
  expect(getTextFromNode(testId1)).toBe('venus');
  expect(getTextFromNode(testId4)).toBe('venus');
  expect(countRender1).toHaveBeenCalledTimes(3);
  expect(countRender2).toHaveBeenCalledTimes(1);
  expect(countRender3).toHaveBeenCalledTimes(1);
  expect(countRender4).toHaveBeenCalledTimes(2);
  expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(2);
  expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(0);

  fireEvent.change(getByTestId(testId5), { target: { value: '2' } });
  expect(getTextFromNode(testId1)).toBe('venus');
  expect(getTextFromNode(testId4)).toBe('moon');
  fireNode(testId2, 'saturn');
  fireNode(testId3, 'jupiter');
  expect(getTextFromNode(testId1)).toBe('saturn');
  expect(getTextFromNode(testId4)).toBe('jupiter');
  expect(countRender1).toHaveBeenCalledTimes(4);
  expect(countRender2).toHaveBeenCalledTimes(1);
  expect(countRender3).toHaveBeenCalledTimes(1);
  expect(countRender4).toHaveBeenCalledTimes(4);
  expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(1);
  expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(1);

  fireEvent.change(getByTestId(testId5), { target: { value: '3' } });
  expect(getTextFromNode(testId1)).toBe('mars');
  expect(getTextFromNode(testId4)).toBe('mars');
  fireNode(testId2, 'uranus');
  fireNode(testId3, 'mercury');
  expect(getTextFromNode(testId1)).toBe('uranus');
  expect(getTextFromNode(testId4)).toBe('uranus');
  expect(countRender1).toHaveBeenCalledTimes(6);
  expect(countRender2).toHaveBeenCalledTimes(1);
  expect(countRender3).toHaveBeenCalledTimes(1);
  expect(countRender4).toHaveBeenCalledTimes(6);
  expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(2);
  expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(0);

  fireEvent.change(getByTestId(testId5), { target: { value: '1' } });
  expect(getTextFromNode(testId1)).toBe('uranus');
  expect(getTextFromNode(testId4)).toBe('uranus');
  expect(countRender1).toHaveBeenCalledTimes(6);
  expect(countRender2).toHaveBeenCalledTimes(1);
  expect(countRender3).toHaveBeenCalledTimes(1);
  expect(countRender4).toHaveBeenCalledTimes(7);
  expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(2);
  expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(0);

  fireEvent.change(getByTestId(testId5), { target: { value: '2' } });
  expect(getTextFromNode(testId4)).toBe('mercury');
  expect(countRender1).toHaveBeenCalledTimes(6);
  expect(countRender2).toHaveBeenCalledTimes(1);
  expect(countRender3).toHaveBeenCalledTimes(1);
  expect(countRender4).toHaveBeenCalledTimes(8);
  expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(1);
  expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(1);

  fireEvent.change(getByTestId(testId5), { target: { value: '4' } });
  expect(getTextFromNode(testId4)).toBe('mercury');
  expect(countRender1).toHaveBeenCalledTimes(6);
  expect(countRender2).toHaveBeenCalledTimes(1);
  expect(countRender3).toHaveBeenCalledTimes(1);
  expect(countRender4).toHaveBeenCalledTimes(9);
  expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(1);
  expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(1);

  fireEvent.change(getByTestId(testId5), { target: { value: '1' } });
  expect(getTextFromNode(testId1)).toBe('uranus');
  expect(getTextFromNode(testId4)).toBe('uranus');
  expect(countRender1).toHaveBeenCalledTimes(6);
  expect(countRender2).toHaveBeenCalledTimes(1);
  expect(countRender3).toHaveBeenCalledTimes(1);
  expect(countRender4).toHaveBeenCalledTimes(10);
  expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(2);
  expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(0);

  fireEvent.change(getByTestId(testId5), { target: { value: '3' } });
  expect(getTextFromNode(testId1)).toBe('uranus');
  expect(getTextFromNode(testId4)).toBe('uranus');
  expect(countRender1).toHaveBeenCalledTimes(6);
  expect(countRender2).toHaveBeenCalledTimes(1);
  expect(countRender3).toHaveBeenCalledTimes(1);
  expect(countRender4).toHaveBeenCalledTimes(11);
  expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(2);
  expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(0);

  fireEvent.change(getByTestId(testId5), { target: { value: '2' } });
  expect(getTextFromNode(testId1)).toBe('uranus');
  expect(getTextFromNode(testId4)).toBe('mars');
  expect(countRender1).toHaveBeenCalledTimes(6);
  expect(countRender2).toHaveBeenCalledTimes(1);
  expect(countRender3).toHaveBeenCalledTimes(1);
  expect(countRender4).toHaveBeenCalledTimes(12);
  expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(1);
  expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(1);

  unmount();
  expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(0);
  expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(0);
};

describe('Test useInterstate functionality for primary API', () => {
  const imports: PrimaryAPIMergedImport = {} as PrimaryAPIMergedImport;

  beforeEach(() => {
    jest.isolateModules(() => {
      Object.assign(imports, require('./prerequisite'), require('./testComponentPrimaryAPI'));
    });
  });

  test('dynamic subscription works', dynamicSubscriptionWorks(imports));
});

describe('Test useInterstate functionality for secondary API', () => {
  const imports: PrimaryAPIMergedImport = {} as PrimaryAPIMergedImport;

  beforeEach(() => {
    jest.isolateModules(() => {
      Object.assign(imports, require('./prerequisite'), require('./testComponentSecondAPI'));
    });
  });

  test('dynamic subscription works', dynamicSubscriptionWorks(imports));
});
