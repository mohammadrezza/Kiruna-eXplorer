import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DocumentMap from '../../src/components/DocumentsMap'; // Adjust the import path as necessary
import '@testing-library/jest-dom';
import { useOutletContext } from 'react-router-dom';
import { mockDocuments } from '../__mocks__/document';
import { useAuth } from '../../src/layouts/AuthContext.jsx';

// Mock the necessary parts of react-leaflet and other dependencies
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => <div>TileLayer Mock</div>,
}));

jest.mock('react-leaflet-markercluster', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock('../../src/components/DocumentsMap/MapMarkers.jsx', () => ({
  MapMarkers: () => <div>MapMarkers Mock</div>,
  createClusterIcon: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: jest.fn(),
}));

// Correct mock for useAuth
jest.mock('../../src/layouts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('DocumentMap', () => {
  const mockList = mockDocuments;

  beforeEach(() => {
    // Mocking useOutletContext and useAuth
    useOutletContext.mockReturnValue({ list: mockList });
    useAuth.mockReturnValue({ user: { name: 'Test User', role: 'admin' } }); // Mock user object
  });

  it('renders MunicipalDocuments and MapContainer correctly', async () => {
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

  it('handles map layer switching correctly', () => {
    render(
      <BrowserRouter>
        <DocumentMap />
      </BrowserRouter>
    );

    // Verify default layer is Satellite
    expect(screen.getByText('Satellite View')).toBeInTheDocument();

    // Simulate layer switch to Streets
    fireEvent.click(screen.getByText('Satellite View'));

    // Verify Streets layer is activated
    expect(screen.getByText('Street View')).toBeInTheDocument();

    // Switch back to Satellite
    fireEvent.click(screen.getByText('Street View'));

    // Verify Satellite layer is re-activated
    expect(screen.getByText('Satellite View')).toBeInTheDocument();
  });

});
