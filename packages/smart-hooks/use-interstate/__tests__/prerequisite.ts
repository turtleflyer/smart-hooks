// tslint:disable-next-line: no-implicit-dependencies
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import * as mockedStoryFactory from '../storeFactory';
import { StoreMap } from '../storeFactory';
import { SetInterstate } from '../useInterstate';

const { getLastMap } = mockedStoryFactory as typeof mockedStoryFactory & {
  getLastMap: () => StoreMap;
};

jest.mock('../storeFactory.ts');

type ArgsType<T> = T extends (...args: infer R) => any ? R : any;
type FirstArrayMember<T> = T extends [infer R, ...any[]] ? R : any;

function newRender(arg: FirstArrayMember<ArgsType<typeof render>>) {
  const fromRender = render(arg);
  const { getByTestId } = fromRender;

  const fireNode = (testId: string, value: string) => {
    const element = getByTestId(testId);
    fireEvent.change(
      element.nodeName === 'INPUT'
        ? (element as HTMLElement)
        : (element.querySelector('input') as HTMLElement),
      {
        target: { value },
      },
    );
  };

  const getTextFromNode = (testId: string) => {
    const element = getByTestId(testId);
    const elementWithText =
      !element.firstChild || element.firstChild.nodeName === '#text'
        ? (element as HTMLElement)
        : (element.querySelector('div') as HTMLElement);
    return elementWithText.firstChild
      ? (elementWithText.firstChild as HTMLElement).textContent
      : '';
  };

  return { ...fromRender, fireNode, getTextFromNode };
}

interface PrerequisiteImport {
  render: typeof newRender;
  getLastMap: typeof getLastMap;
  fireEvent: typeof fireEvent;
}

type ComposeCallback = (set: SetInterstate) => ({ target: { value } }: any) => void;

const defaultComposeCallback: ComposeCallback = set => ({ target: { value } }) => {
  set(value);
};

export {
  newRender as render,
  getLastMap,
  fireEvent,
  PrerequisiteImport,
  defaultComposeCallback,
  ComposeCallback,
};
