import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  MapMarkers,
  MapCentroids,
} from '../../../src/components/DocumentsMap/MapMarkers';
import L from 'leaflet';
import { mockDocuments } from '../../__mocks__/document';

// Mock dependencies
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
    {
      name: 'default',
      iconUrl: 'path/to/default-icon.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    },
  ],
}));

jest.mock('react-leaflet', () => ({
  Marker: ({ children }) => <div>{children}</div>, // Mock Marker
  Popup: ({ children }) => <div>{children}</div>, // Mock Popup
  Tooltip: ({ children }) => <div>{children}</div>, // Mock Tooltip
}));

jest.mock('leaflet', () => ({
  icon: jest.fn(() => ({ mockIcon: true })), // Mock L.icon function
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('MapMarkers Component', () => {
  it('renders the correct number of markers based on the document list', () => {
    render(<MapMarkers list={mockDocuments} user={{}} />);

    const markers = screen.getAllByText(/Stakeholders/i);
    expect(markers).toHaveLength(2);
  });

  it('assigns the correct icon based on document type', () => {
    render(<MapMarkers list={mockDocuments} user={{}} />);

    expect(L.icon).toHaveBeenCalledTimes(3);

    expect(L.icon).toHaveBeenCalledWith({
      iconUrl: 'path/to/icon1.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      className: 'custom-marker-icon',
    });
  });

  it('renders "Open the document" link if user is present', () => {
    render(<MapMarkers list={mockDocuments} user={{ name: 'Test User' }} />);

    const openLinks = screen.getAllByText(/Open the document/i);
    expect(openLinks).toHaveLength(2); // One for each valid document
  });

  it('calls handleDocumentClick when "Open the document" link is clicked', () => {
    render(<MapMarkers list={mockDocuments} user={{ name: 'Test User' }} />);

    const openLinks = screen.getAllByText(/Open the document/i);
    fireEvent.click(openLinks[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/document/view/1');

    fireEvent.click(openLinks[1]);
    expect(mockNavigate).toHaveBeenCalledWith('/document/view/3');
  });

  it('does not render markers for documents with invalid coordinates', () => {
    render(<MapMarkers list={mockDocuments} user={{}} />);

    const markers = screen.queryAllByText(/Document 2/);
    expect(markers).toHaveLength(0);
  });
});

describe('MapCentroids Component', () => {
  it('renders the correct number of centroid markers based on the list', () => {
    render(
      <MapCentroids
        list={mockDocuments}
        user={{}}
        handlePointClick={() => {}}
        handlePopupClose={() => {}}
      />
    );

    const markers = screen.getAllByText(/Stakeholders/i);
    expect(markers).toHaveLength(2);
  });

  it('assigns the correct icon to centroids based on document type', () => {
    render(
      <MapCentroids
        list={mockDocuments}
        user={{}}
        handlePointClick={() => {}}
        handlePopupClose={() => {}}
      />
    );

    expect(L.icon).toHaveBeenCalledTimes(3);

    expect(L.icon).toHaveBeenCalledWith({
      iconUrl: 'path/to/icon1.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      className: 'custom-area-icon',
    });
  });

  it('renders "Open the document" link in centroids if user is present', () => {
    render(
      <MapCentroids
        list={mockDocuments}
        user={{ name: 'Test User' }}
        handlePointClick={() => {}}
        handlePopupClose={() => {}}
      />
    );

    const openLinks = screen.getAllByText(/Open the document/i);
    expect(openLinks).toHaveLength(2);
  });

  it('does not render centroids for documents with invalid coordinates', () => {
    render(
      <MapCentroids
        list={mockDocuments}
        user={{}}
        handlePointClick={() => {}}
        handlePopupClose={() => {}}
      />
    );

    const markers = screen.queryAllByText(/Document 2/);
    expect(markers).toHaveLength(0);
  });
});
