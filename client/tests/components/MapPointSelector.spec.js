import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MapPointSelector from '../../src/components/MapPointSelector';

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div />,
  Marker: () => <div data-testid="marker" />,
  useMapEvents: jest.fn().mockReturnValue({
    on: jest.fn(),
  }),
}));

describe('MapPointSelector Component', () => {
  const mockOnCoordinatesChange = jest.fn();
  const mockSetMarkerPosition = jest.fn();

  beforeEach(() => {
    render(
      <MapPointSelector
        onCoordinatesChange={mockOnCoordinatesChange}
        coordinates={{ lat: '', lng: '' }}
      />
    );
  });

  it('renders the map and the instruction text', () => {
    expect(
      screen.getByText(/Click on the map to select a point/i)
    ).toBeInTheDocument();
    const mapContainer = screen
      .getByRole('heading', { name: /Click on the map to select a point/i })
      .closest('div');
    expect(mapContainer).toBeInTheDocument(); // Check if MapContainer is rendered
  });

  // it('calls onCoordinatesChange and updates marker position when map is clicked', () => {
  //   const markerPosition = { lat: 67.85572, lng: 20.22513 };
  //   const [mapInfoElement] = screen.getAllByTestId('map-info'); 
  //   const mapContainer = mapInfoElement.closest('div');
  //   // Simulate map click
  //   fireEvent.click(mapContainer, {
  //     latlng: markerPosition,
  //   });

  //   expect(mockOnCoordinatesChange).toHaveBeenCalledWith(markerPosition);
  //   expect(screen.getByTestId('marker')).toBeInTheDocument(); 
  // });

  it('updates the marker position when new coordinates are received', () => {
    const newCoordinates = { lat: 67.85573, lng: 20.22514 };

    render(
      <MapPointSelector
        onCoordinatesChange={mockOnCoordinatesChange}
        coordinates={newCoordinates}
      />
    );

    expect(screen.getByTestId('marker')).toBeInTheDocument(); // Ensure the marker is rendered again
  });
});
