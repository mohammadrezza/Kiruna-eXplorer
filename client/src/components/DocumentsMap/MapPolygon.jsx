import React from 'react';
import { Polygon, Popup } from 'react-leaflet';

const MapPolygon = ({ list }) => {
  return list.map((doc) => {
    // Validate that the area exists and has at least 3 coordinates
    if (!doc.area || doc.area.length < 3) {
      console.log(`Skipping polygon for ${doc.id} due to invalid or missing area`);
      return null; 
    }

    return (
      <Polygon key={doc.id} positions={doc.area} color="blue" fillColor="blue" fillOpacity={0.5}>
        <Popup>{doc.title}</Popup>
      </Polygon>
    );
  });
};

export { MapPolygon };
