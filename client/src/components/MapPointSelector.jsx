import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Default center of the map
const initialCenter = { lat: 67.85572, lng: 20.22513 };

function LocationMarker({ setSelectedLocation }) {
  // This hook handles the map click to place a marker
  useMapEvents({
    click(event) {
      setSelectedLocation(event.latlng);
    },
  });
  return null;
}

function MapPointSelector() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div>
      <h5>Click on the map to select a point</h5>
      <MapContainer
        center={initialCenter}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        {/* OpenStreetMap tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Marker for selected location */}
        {selectedLocation && (
          <Marker position={selectedLocation}></Marker>
        )}

        {/* Component to capture map clicks */}
        <LocationMarker setSelectedLocation={setSelectedLocation} />
      </MapContainer>

      {/* Display selected coordinates */}
      {selectedLocation && (
        <div>
          <p>Latitude: {selectedLocation.lat.toFixed(4)}</p>
          <p>Longitude: {selectedLocation.lng.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
}

export default MapPointSelector;
