import { flagManager } from '../__tests__/testFlags';
import { mockReactUseMemo } from '../../../../test_utilities/mockReactUseMemo';

const react = jest.requireActual('react');

module.exports = mockReactUseMemo(react, flagManager);
