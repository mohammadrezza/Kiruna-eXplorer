import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { pointer } from '../utils/mapIcons';
import 'leaflet/dist/leaflet.css';
import  '../style/map.css';

function MapEvents({ onCoordinatesChange, setMarkerPosition, mode, edit }) {
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
  const initialCenter = { lat: 67.85572, lng: 20.22513 };
  const kirunaBounds = L.latLngBounds(
    [67.765, 20.090],
    [67.900, 20.420] 
  );
  const icon = L.icon({
    iconUrl: pointer.iconUrl,
    iconSize: pointer.iconSize,
    iconAnchor: pointer.iconAnchor,
  })

  useEffect(() => {
    if (coordinates.lat !== '' || coordinates.lng !== '') {
      setMarkerPosition([coordinates.lat, coordinates.lng]);
    } 
  }, [coordinates]);

  return (
    <div>
      {(mode === 'add' || edit) && (
        <h5 className='map-view-text' data-testid="map-info">Click on the map to select a point</h5>
      )}
      <MapContainer
        center={initialCenter}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        minZoom={11}
        maxZoom={17}
        maxBounds={kirunaBounds} 
        maxBoundsViscosity={1.0} 
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapEvents edit={edit} mode={mode} onCoordinatesChange={onCoordinatesChange} setMarkerPosition={setMarkerPosition}/>
        {markerPosition && <Marker position={markerPosition} icon={icon}/>}
      </MapContainer>
    </div>
  );
}

export default MapPointSelector;
