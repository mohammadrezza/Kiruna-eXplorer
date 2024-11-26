import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DocumentMap from '../../src/components/DocumentsMap'; // Adjust the import path as necessary
import '@testing-library/jest-dom';
import { useOutletContext } from 'react-router-dom';
import { mockDocuments } from '../__mocks__/document';

// Mock the necessary parts of react-leaflet and other dependencies
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => <div>TileLayer Mock</div>,
}));

jest.mock('react-leaflet-markercluster', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock('../../src/components/maps/MapMarkers.jsx', () => ({
  MapMarkers: () => <div>MapMarkers Mock</div>,
  createClusterIcon: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: jest.fn(),
}));

describe('DocumentMap', () => {
  const mockList = mockDocuments;

  it('renders MunicipalDocuments and MapContainer correctly', async () => {
    // Mock the context for useOutletContext
    useOutletContext.mockReturnValue({ list: mockList });

    render(
      <BrowserRouter>
        <DocumentMap />
      </BrowserRouter>
    );

    // Check if the MunicipalDocuments component displays correctly
    expect(
      screen.getByText('There are documents for the whole municipal.')
    ).toBeInTheDocument();

    // Simulate clicking the toggle button
    fireEvent.click(screen.getByText('Show them'));

    // Check if documents are displayed after clicking
    await waitFor(() => {
      expect(screen.getByText('Document 2')).toBeInTheDocument();
    });

    // Check if MapContainer is rendered
    expect(screen.getByText('TileLayer Mock')).toBeInTheDocument();

    // Check if MapMarkers is rendered
    expect(screen.getByText('MapMarkers Mock')).toBeInTheDocument();
  });
});
