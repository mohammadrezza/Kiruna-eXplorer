import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { pointer } from '@/utils/mapIcons';
import { kirunaBounds, initialMapCenter } from "@/utils/constants.js";
import 'leaflet/dist/leaflet.css';
import  '@/style/map.css';


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
  const kirunaBoundsMap = L.latLngBounds(kirunaBounds);
  const icon = L.icon({
    iconUrl: pointer.iconUrl,
    iconSize: pointer.iconSize,
    iconAnchor: pointer.iconAnchor,
  })

  useEffect(() => {
    if (coordinates && coordinates.lat && coordinates.lng) {
      setMarkerPosition([coordinates.lat, coordinates.lng]);
    }
  }, [coordinates]);

  return (
    <div>
      {(mode === 'add' || edit) && (
        <h5 className='map-view-text' data-testid="map-info">Click on the map to select a point</h5>
      )}
      <MapContainer
        center={initialMapCenter}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        minZoom={11}
        maxZoom={17}
        maxBounds={kirunaBoundsMap} 
        maxBoundsViscosity={1.0} 
      >
        <TileLayer url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        />
        
        <MapEvents edit={edit} mode={mode} onCoordinatesChange={onCoordinatesChange} setMarkerPosition={setMarkerPosition}/>
        {markerPosition && <Marker position={markerPosition} icon={icon}/>}
      </MapContainer>
    </div>
  );
}

export default MapPointSelector;
