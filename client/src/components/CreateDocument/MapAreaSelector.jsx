import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon } from 'react-leaflet';
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

const MapAreaSelector = ({ area, mode, edit, onAreaChange }) => {
  const [polygon, setPolygon] = useState(null); // Allow only one polygon
  const mapRef = useRef(null);
  const featureGroupRef = useRef(null); // Reference to FeatureGroup for editing
  // Handle polygon creation
  const handleCreated = (e) => {
    if (polygon) {
      // Prevent multiple polygons
      e.target.removeLayer(e.layer);
      alert("Only one polygon can be drawn at a time.");
      return;
    }

    const { layer } = e;
    const polygonCoords = layer.getLatLngs()[0].map((coord) => ({
      lat: coord.lat,
      lng: coord.lng,
    }));
    const convertedCoordinates = polygonCoords.map(coord => [coord.lat, coord.lng]);

    setPolygon(polygonCoords);
    onAreaChange(convertedCoordinates);
  };

  // Handle polygon deletion
  const handleDeleted = () => {
    setPolygon(null);
    onAreaChange([]);
  };

  // Handle polygon editing
  const handleEdited = (e) => {
    const editedCoords = e.layers.getLayers()[0].getLatLngs()[0].map((coord) => ({
      lat: coord.lat,
      lng: coord.lng,
    }));
    onAreaChange(editedCoords);
  };

  const isEditable = mode === 'add' || edit;

  // Set the initial polygon if area exists
  useEffect(() => {
    if (area && area.length) {
      setPolygon(area); // Set the polygon based on the existing area
    }
  }, [area]);

  useEffect(() => {
    if (polygon && featureGroupRef.current) {
      // Add the polygon to the FeatureGroup as a Leaflet layer
      const leafletPolygon = L.polygon(polygon);
      featureGroupRef.current.clearLayers(); // Clear any existing layers
      featureGroupRef.current.addLayer(leafletPolygon); // Add the existing polygon as a layer
    }
  }, [polygon, edit]);

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
        <TileLayer url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        />

        {isEditable && (
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topright"
              onCreated={handleCreated}
              onDeleted={handleDeleted}
              onEdited={handleEdited}
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
        )}

        {/* {polygon && (
          <Polygon
            positions={polygon}
            color="blue"
            fillColor="blue"
            fillOpacity={0.5}
          />
        )} */}
      </MapContainer>
      {/* <div className="mt-4">
        <h3 className="font-bold mb-2">Drawn Polygon:</h3>
        {polygon ? (
          <div className="mb-2 p-2 bg-gray-100 rounded">
            <p>Polygon:</p>
            {polygon.map((coord, index) => (
              <p key={index} className="text-sm">
                Point {index + 1}: Lat {coord.lat.toFixed(4)}, Lng {coord.lng.toFixed(4)}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No polygon drawn yet.</p>
        )}
      </div> */}
    </div>
  );
};

export default MapAreaSelector;
