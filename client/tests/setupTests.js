import '@testing-library/jest-dom'; // Adds custom matchers like `toBeInTheDocument`
jest.mock('react-bootstrap', () => require('./__mocks__/reactBootstrap'));
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));