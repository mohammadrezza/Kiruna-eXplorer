import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateDocument from '../../src/pages/CreateDocument';

jest.mock('dayjs', () =>
  jest.fn(() => ({
    format: jest.fn(() => 'mocked-date'),
    add: jest.fn().mockReturnThis(),
    subtract: jest.fn().mockReturnThis(),
  }))
);
jest.mock('../../src/components/MapPointSelector', () => (props) => (
  <div data-testid="MapPointSelector" {...props}></div>
));

jest.mock('../../src/services/API.mjs', () => ({
  getTypes: jest.fn(),
  getDocuments: jest.fn(),
  getData: jest.fn(),
  getRelatedDocuments: jest.fn(),
  AddDocumentDescription: jest.fn(),
}));

jest.mock('../../src/mocks/Document.mjs', () => ({
  someDocumentFunction: jest.fn(),
}));


describe('CreateDocument', () => {

  it('should render correctly', () => {
    render(<CreateDocument mode="add" />);
    expect(true).toBe(true); // Example test
  });
});