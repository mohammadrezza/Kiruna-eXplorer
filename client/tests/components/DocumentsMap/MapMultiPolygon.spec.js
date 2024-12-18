import React from 'react';
import { render, screen } from '@testing-library/react';
import { MapMultiPolygon } from '../../../src/components/DocumentsMap/MapMultiPolygon';

// Mock the Polygon component from react-leaflet
jest.mock('react-leaflet', () => ({
  Polygon: ({ positions }) => (
    <div data-testid="polygon">{JSON.stringify(positions)}</div>
  ),
}));

describe('MapMultiPolygon Component', () => {
  const mockList = [
    [
      [
        [51.505, -0.09],
        [51.51, -0.1],
        [51.51, -0.08],
      ],
      [
        [51.505, -0.07],
        [51.51, -0.06],
        [51.51, -0.05],
      ],
    ],
    [
      [
        [51.52, -0.12],
        [51.53, -0.13],
        [51.54, -0.11],
      ],
    ],
  ];

  it('renders polygons for each sub-array of positions in the list', () => {
    render(<MapMultiPolygon list={mockList} />);

    // Check that the number of rendered polygons matches the number of sub-arrays in the mock list
    const polygons = screen.getAllByTestId('polygon');
    expect(polygons).toHaveLength(3);

    // Verify that the positions of each polygon match the mock data
    expect(polygons[0]).toHaveTextContent(JSON.stringify(mockList[0][0]));
    expect(polygons[1]).toHaveTextContent(JSON.stringify(mockList[0][1]));
    expect(polygons[2]).toHaveTextContent(JSON.stringify(mockList[1][0]));
  });

  it('handles an empty list gracefully', () => {
    render(<MapMultiPolygon list={[]} />);

    // Ensure no polygons are rendered
    const polygons = screen.queryAllByTestId('polygon');
    expect(polygons).toHaveLength(0);
  });
});
