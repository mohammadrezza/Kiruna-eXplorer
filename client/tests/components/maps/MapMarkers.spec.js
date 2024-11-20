import React from 'react';
import { render, screen } from '@testing-library/react';
import { MapMarkers } from '../../../src/components/maps/MapMarkers';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { mockDocuments } from '../../__mocks__/document';
jest.mock('../../../src/utils/mapIcons');

jest.mock('react-leaflet', () => ({
  Marker: ({ children }) => <div>{children}</div>, // Mock Marker
  Popup: ({ children }) => <div>{children}</div>, // Mock Popup
}));

jest.mock('leaflet', () => ({
  icon: jest.fn(() => ({ mockIcon: true })), // Mock L.icon function
}));

// Mock iconData import
jest.mock('../../../src/utils/mapIcons', () => ({
  iconData: [
    {
      name: 'Material Effect',
      iconUrl: 'path/to/icon1.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    },
    {
      name: 'Design Document',
      iconUrl: 'path/to/icon2.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    },
  ],
}));

describe('MapMarkers Component', () => {

  it('renders the correct number of markers based on the document list', () => {
    render(<MapMarkers list={mockDocuments} />);

    const markers = screen.getAllByText(/Document/i);
    expect(markers).toHaveLength(2); // Only two valid documents should render markers
  });

  it('assigns the correct icon based on document type', () => {
    render(<MapMarkers list={mockDocuments} />);

    // Check that L.icon was called twice (for each document with valid coordinates)
    expect(L.icon).toHaveBeenCalledTimes(2);

    // Check for icon assignment based on document type
    expect(L.icon).toHaveBeenCalledWith({
      iconUrl: 'path/to/icon1.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      className: 'custom-marker-icon',
    });
  });

//   it('displays the correct popup content for each marker', () => {
//     render(<MapMarkers list={mockDocuments} />);

//     // Check popup content for the first valid document
//     expect(screen.getByText(/Document 1/)).toBeInTheDocument();
//     expect(screen.getByText(/Material Effect/)).toBeInTheDocument();
//     expect(screen.getByText(/Stakeholder A/)).toBeInTheDocument();
//     expect(screen.getByText(/2024-11-20/)).toBeInTheDocument();

//     // Check popup content for the second valid document
//     expect(screen.getByText(/Document 3/)).toBeInTheDocument();
//     expect(screen.getByText(/Material Effect/)).toBeInTheDocument();
//     expect(screen.getByText(/Stakeholder C/)).toBeInTheDocument();
//     expect(screen.getByText(/2024-11-22/)).toBeInTheDocument();
//   });

  it('does not render markers for documents with invalid coordinates', () => {
    render(<MapMarkers list={mockDocuments} />);

    // Document 2 has invalid coordinates, so no marker should be rendered
    const markers = screen.queryAllByText(/Document 2/);
    expect(markers).toHaveLength(0); // No marker for invalid coordinates
  });
});
