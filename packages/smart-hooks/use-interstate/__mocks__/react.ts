import { mockReactUseMemo } from '@~internal/test-utilities/mockReactUseMemo';
import { flagManager } from '../__tests__/testFlags';

const react = jest.requireActual('react');

module.exports = mockReactUseMemo(react, flagManager);
