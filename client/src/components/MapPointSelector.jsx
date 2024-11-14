import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import  '../style/map.css';

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Default center of the map
const initialCenter = { lat: 67.85572, lng: 20.22513 };

function MapEvents({ onCoordinatesChange, setMarkerPosition, mode, edit }) {
  // This hook handles the map click to place a marker
  useMapEvents({
    click(e) {
      if(mode === 'add' || edit){
        const { lat, lng } = e.latlng;
        onCoordinatesChange({ lat, lng });
        setMarkerPosition([lat, lng]);
      }
    },
  });
  return null;
}

function MapPointSelector({ onCoordinatesChange, coordinates, mode, edit  }) {
  const [markerPosition, setMarkerPosition] = useState(null); 
   const kirunaBounds = L.latLngBounds(
    [67.821, 20.216],
    [67.865, 20.337] 
  );

  useEffect(() => {
    if (coordinates.lat !== '' || coordinates.lng !== '') {
      setMarkerPosition([coordinates.lat, coordinates.lng]);
    } 
  }, [coordinates]);

  return (
    <div>
      <h5 className='map-view-text' data-testid="map-info">Click on the map to select a point</h5>
      <MapContainer
        center={initialCenter}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        minZoom={11}
        maxZoom={17}
        maxBounds={kirunaBounds} 
        maxBoundsViscosity={1.0} 
      >
        {/* OpenStreetMap tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapEvents edit={edit} mode={mode} onCoordinatesChange={onCoordinatesChange} setMarkerPosition={setMarkerPosition}/>
        {markerPosition && <Marker position={markerPosition} />}
      </MapContainer>
    </div>
  );
}

export default MapPointSelector;
