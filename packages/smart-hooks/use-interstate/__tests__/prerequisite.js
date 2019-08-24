/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */

import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// eslint-disable-next-line import/named
import { getLastMaps } from '../../../../src/utils/getStore';

jest.mock('../../../../src/utils/getStore.js');

const newRender = (...arg) => {
  const fromRender = render(...arg);
  const { getByTestId } = fromRender;

  const fireNode = (testId, value) => {
    const element = getByTestId(testId);
    fireEvent.change(element.nodeName === 'INPUT' ? element : element.querySelector('input'), {
      target: { value },
    });
  };

  const getTextFromNode = (testId) => {
    const element = getByTestId(testId);
    const elementWithText = !element.firstChild || element.firstChild.nodeName === '#text'
      ? element
      : element.querySelector('div');
    return elementWithText.firstChild ? elementWithText.firstChild.textContent : '';
  };

  return { ...fromRender, fireNode, getTextFromNode };
};

export { newRender as render, getLastMaps, fireEvent };
