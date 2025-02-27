// This file runs before each test file
import { jest } from '@jest/globals';

// Mock timers for setTimeout
jest.useFakeTimers();

// Dummy test to avoid the "must contain at least one test" error
test('jest setup works', () => {
  expect(true).toBe(true);
});

// After each test, clear all mocks and timers
afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});