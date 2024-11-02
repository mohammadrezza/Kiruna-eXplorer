import '@testing-library/jest-dom'; // Adds custom matchers like `toBeInTheDocument`
jest.mock('react-bootstrap', () => require('./__mocks__/reactBootstrap'));