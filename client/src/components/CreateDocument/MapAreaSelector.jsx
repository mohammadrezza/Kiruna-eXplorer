import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import { kirunaBounds, initialMapCenter } from "@/utils/constants.js";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapAreaSelector = () => {
  const [polygons, setPolygons] = useState([]);
  const mapRef = useRef(null);

  // Handle polygon creation
  const handleCreated = (e) => {
    const { layer } = e;
    const polygonCoords = layer.getLatLngs()[0].map((coord) => ({
      lat: coord.lat,
      lng: coord.lng,
    }));

    setPolygons((prevPolygons) => [...prevPolygons, polygonCoords]);
  };

  // Handle polygon deletion
  const handleDeleted = (e) => {
    const { layers } = e;
    const deletedPolygons = layers.getLayers().map((layer) =>
      layer.getLatLngs()[0].map((coord) => ({
        lat: coord.lat,
        lng: coord.lng,
      }))
    );

    setPolygons((prevPolygons) =>
      prevPolygons.filter(
        (polygon) =>
          !deletedPolygons.some((deletedPolygon) =>
            polygon.every(
              (coord, index) =>
                coord.lat === deletedPolygon[index].lat &&
                coord.lng === deletedPolygon[index].lng
            )
          )
      )
    );
  };

  return (
    <div>
      <MapContainer
        center={initialMapCenter}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        bounds={kirunaBounds}
        maxBounds={L.latLngBounds(kirunaBounds)}
        maxBoundsViscosity={1.0}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            onDeleted={handleDeleted}
            draw={{
              polygon: true,
              polyline: false,
              rectangle: false,
              circle: false,
              circlemarker: false,
              marker: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>

      <div className="mt-4">
        <h3 className="font-bold mb-2">Drawn Polygons:</h3>
        {polygons.map((polygon, index) => (
          <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
            <p>Polygon {index + 1}:</p>
            {polygon.map((coord, coordIndex) => (
              <p key={coordIndex} className="text-sm">
                Point {coordIndex + 1}: Lat {coord.lat.toFixed(4)}, Lng{' '}
                {coord.lng.toFixed(4)}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapAreaSelector;
