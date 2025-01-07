import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeVisible(): R;
      toBeInTheDocument(): R;
      toHaveStyle(style: Record<string, any>): R;
    }
  }
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock GSAP
jest.mock('gsap', () => ({
  to: jest.fn(),
  fromTo: jest.fn(),
  timeline: jest.fn(() => ({
    to: jest.fn(),
    fromTo: jest.fn(),
    add: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    kill: jest.fn(),
  })),
  set: jest.fn(),
})); 