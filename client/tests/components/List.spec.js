import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import List from '../../src/components/List';
import API from '../../src/services/API.mjs';

jest.mock('../../src/services/API.mjs', () => ({
  getData: jest.fn(),
  getSortedDocuments: jest.fn()
}));

jest.mock('../../src/components/DocumentDetailsModal', () => (props) => (
  <div data-testid="DocumentDetailsModal" {...props}></div>
));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useOutletContext: jest.fn(),
}));

const MockList= [
  {
    id: 'doc1',
    title: 'doc1',
    stakeholders: ['KLAB'],
    scale: 'Mock Scale',
    issuanceDate: '2023-01-01',
    type: 'tipo1',
    language: 'english',
    description: 'Mock description',
    coordinates: { lat: '67.821', lng: '20.216' },
    connections: '2',
  },
  {
    id: 'doc2',
    title: 'doc2',
    stakeholders: ['Mun', 'City'],
    scale: 'Mock Scale',
    issuanceDate: '2023-01-02',
    type: 'tipo2',
    language: 'swedish',
    description: 'Mock description',
    coordinates: { lat: '67.821', lng: '20.216' },
    connections: '1',
  },
]

describe('List component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    
  });

  test('renders the document list', () => {
    useOutletContext.mockReturnValue({
      list: [
        {
          id: 'doc1',
          title: 'doc1',
          stakeholders: ['KLAB'],
          scale: 'Mock Scale',
          issuanceDate: '2023-01-01',
          type: 'tipo1',
          language: 'english',
          description: 'Mock description',
          coordinates: { lat: '67.821', lng: '20.216' },
          connections: '2',
        },
        {
          id: 'doc2',
          title: 'doc2',
          stakeholders: ['Mun', 'City'],
          scale: 'Mock Scale',
          issuanceDate: '2023-01-02',
          type: 'tipo2',
          language: 'swedish',
          description: 'Mock description',
          coordinates: { lat: '67.821', lng: '20.216' },
          connections: '1',
        },
      ],
      loading: false,
    });
    render(<List />);

    expect(screen.getByText(/Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Stakeholders/i)).toBeInTheDocument();
    expect(screen.getByText(/Issuance Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Connections/i)).toBeInTheDocument();

    MockList.forEach((doc) => {
      expect(screen.getByText(doc.title)).toBeInTheDocument();
      doc.stakeholders.forEach((s) => {
        expect(screen.getByText(s)).toBeInTheDocument();
      });
      expect(screen.getByText(doc.issuanceDate)).toBeInTheDocument(); // Adjust date format as needed
      expect(screen.getByText(doc.type)).toBeInTheDocument();
      expect(screen.getByText(doc.connections)).toBeInTheDocument();
    });
  });

  test('calls the modal when preview button is pressed', () => {
    useOutletContext.mockReturnValue({
      list: [
        {
          id: 'doc1',
          title: 'doc1',
          stakeholders: ['KLAB'],
          scale: 'Mock Scale',
          issuanceDate: '2023-01-01',
          type: 'tipo1',
          language: 'english',
          description: 'Mock description',
          coordinates: { lat: '67.821', lng: '20.216' },
          connections: '2',
        },
      ],
      loading: false,
    });
    render(<List />);

    const previewButton = screen.getByText('Preview'); // Adjust based on actual button text
    fireEvent.click(previewButton);

    expect(API.getData).toHaveBeenCalledWith('doc1');
  });

  test('navigates to document when title is clicked', () => {
    useOutletContext.mockReturnValue({
      list: [
        {
          id: 'doc1',
          title: 'doc1',
          stakeholders: ['KLAB'],
          scale: 'Mock Scale',
          issuanceDate: '2023-01-01',
          type: 'tipo1',
          language: 'english',
          description: 'Mock description',
          coordinates: { lat: '67.821', lng: '20.216' },
          connections: '2',
        },
        {
          id: 'doc2',
          title: 'doc2',
          stakeholders: ['Mun', 'City'],
          scale: 'Mock Scale',
          issuanceDate: '2023-01-02',
          type: 'tipo2',
          language: 'swedish',
          description: 'Mock description',
          coordinates: { lat: '67.821', lng: '20.216' },
          connections: '1',
        },
      ],
      loading: false,
    });
    render(<List />);

    const titleElement = screen.getByText('doc1');
    fireEvent.click(titleElement);

    expect(mockNavigate).toHaveBeenCalledWith('/document/view/doc1'); // Adjust this path according to your routing logic
  });

  test('sort the list', () => {
    useOutletContext.mockReturnValue({
      list: [
        {
          id: 'doc1',
          title: 'city',
          stakeholders: ['KLAB'],
          scale: 'Mock Scale',
          issuanceDate: '2023-01-01',
          type: 'tipo1',
          language: 'english',
          description: 'Mock description',
          coordinates: { lat: '67.821', lng: '20.216' },
          connections: '2',
        },
        {
          id: 'doc2',
          title: 'doc2',
          stakeholders: ['Mun', 'City'],
          scale: 'Mock Scale',
          issuanceDate: '2023-01-02',
          type: 'tipo2',
          language: 'swedish',
          description: 'Mock description',
          coordinates: { lat: '67.821', lng: '20.216' },
          connections: '1',
        },
      ],
      loading: false,
    });
    render(<List />);

    const title = screen.getByText(/Title/i)

    fireEvent.click(title)

    expect(screen.getByText(/Title ▲/i)).toBeInTheDocument()

    expect(API.getSortedDocuments).toHaveBeenCalledWith('title','asc')

    fireEvent.click(screen.getByText(/Title ▲/i))

    expect(screen.getByText(/Title ▼/i)).toBeInTheDocument()

    expect(API.getSortedDocuments).toHaveBeenCalledWith('title','desc')

    fireEvent.click(screen.getByText(/Type/i))

    expect(screen.getByText(/Type ▲/i)).toBeInTheDocument()

    expect(API.getSortedDocuments).toHaveBeenCalledWith('type','asc')

    fireEvent.click(screen.getByText(/Issuance Date/i))

    expect(screen.getByText(/Issuance Date ▲/i)).toBeInTheDocument()

    expect(API.getSortedDocuments).toHaveBeenCalledWith('issuanceDate','asc')
  });
});