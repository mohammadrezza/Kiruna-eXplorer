import React from 'react';
import { render, screen } from '@testing-library/react';
import { MapPolygon } from '../../../src/components/DocumentsMap/MapPolygon';

// Mock the Polygon component from react-leaflet
jest.mock('react-leaflet', () => ({
  Polygon: ({ positions }) => (
    <div data-testid="polygon">{JSON.stringify(positions)}</div>
  ),
}));

describe('MapPolygon Component', () => {
  const mockList = [
    {
      id: '1',
      area: [
        [51.505, -0.09],
        [51.51, -0.1],
        [51.51, -0.08],
      ],
    },
    {
      id: '2',
      area: [], // Invalid area
    },
    {
      id: '3',
      area: null, // Missing area
    },
    {
      id: '4',
      area: [
        [51.505, -0.09],
        [51.51, -0.1],
      ], // Less than 3 points
    },
  ];

  it('renders polygons for valid areas', () => {
    render(<MapPolygon list={mockList} />);

    // Expect a polygon to be rendered for the valid document
    const polygons = screen.getAllByTestId('polygon');
    expect(polygons).toHaveLength(1);

    // Check that the polygon's positions match the valid document's area
    expect(polygons[0]).toHaveTextContent(JSON.stringify(mockList[0].area));
  });

  it('skips polygons for documents with invalid or missing areas', () => {
    render(<MapPolygon list={mockList} />);

    // Ensure only one polygon is rendered for the valid area
    const polygons = screen.getAllByTestId('polygon');
    expect(polygons).toHaveLength(1);
  });

  it('logs a message for invalid or missing areas', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<MapPolygon list={mockList} />);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Skipping polygon for 2 due to invalid or missing area'
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Skipping polygon for 3 due to invalid or missing area'
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Skipping polygon for 4 due to invalid or missing area'
    );

    consoleSpy.mockRestore();
  });
});
