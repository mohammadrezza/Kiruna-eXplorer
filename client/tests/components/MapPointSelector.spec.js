import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MapPointSelector from '../../src/components/MapPointSelector';
import { useMapEvents } from 'react-leaflet'; // Mocking the leaflet functionality
jest.mock('../../src/utils/mapIcons');

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div />,
  Marker: () => <div data-testid="marker" />,
  useMapEvents: jest.fn(),
}));

describe('MapPointSelector Component', () => {
  const mockOnCoordinatesChange = jest.fn();
  const mockSetMarkerPosition = jest.fn();

  beforeEach(() => {
    render(
      <MapPointSelector
        onCoordinatesChange={mockOnCoordinatesChange}
        coordinates={{ lat: '', lng: '' }}
        mode="add"
        edit={false}
      />
    );
  });

  it('renders the map and the instruction text', () => {
    expect(
      screen.getByText(/Click on the map to select a point/i)
    ).toBeInTheDocument();
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toBeInTheDocument();
  });

  // it('calls onCoordinatesChange and updates marker position when map is clicked', async () => {
  //   const mockCoordinates = { lat: 67.85572, lng: 20.22513 };

  //   // Mock the implementation of useMapEvents to simulate a click event
  //   useMapEvents.mockImplementation(({ click }) => {
  //     // Simulate the click callback being triggered with the mockCoordinates
  //     click({ latlng: mockCoordinates });
  //     return {};
  //   });

  //   // Simulate a click on the map container
  //   const mapContainer = screen.getByTestId('map-container');
  //   fireEvent.click(mapContainer);

  //   // Wait for asynchronous actions to complete
  //   await waitFor(() => {
  //     // Ensure the mock functions are called with the expected arguments
  //     expect(mockOnCoordinatesChange).toHaveBeenCalledWith(mockCoordinates);
  //     expect(mockSetMarkerPosition).toHaveBeenCalledWith([
  //       mockCoordinates.lat,
  //       mockCoordinates.lng,
  //     ]);
  //   });

  //   // Check if the Marker is rendered
  //   expect(screen.getByTestId('marker')).toBeInTheDocument();
  // });

  it('updates the marker position when new coordinates are received via props', () => {
    const newCoordinates = { lat: 67.85573, lng: 20.22514 };

    // Re-render the component with new coordinates
    render(
      <MapPointSelector
        onCoordinatesChange={mockOnCoordinatesChange}
        coordinates={newCoordinates}
        mode="add"
        edit={false}
      />
    );

    expect(screen.getByTestId('marker')).toBeInTheDocument(); // Marker should be rendered with new position
  });
  });
