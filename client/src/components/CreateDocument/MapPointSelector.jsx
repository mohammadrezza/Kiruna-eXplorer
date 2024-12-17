import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { pointer } from '@/utils/mapIcons';
import { kirunaBounds, initialMapCenter } from "@/utils/constants.js";
import { MapMultiPolygon } from '@/components/DocumentsMap/MapMultiPolygon';
import 'leaflet/dist/leaflet.css';
import '@/style/map.css';
import PropTypes from 'prop-types';

function MapEvents({ onCoordinatesChange, setMarkerPosition, mode, edit }) {
  useMapEvents({
    click(e) {
      if (mode === 'add' || edit) {
        const { lat, lng } = e.latlng;
        onCoordinatesChange({ lat, lng });
        setMarkerPosition([lat, lng]);
      }
    },
  });
  return null;
}

function MapPointSelector({ onCoordinatesChange, coordinates, existList, mode, edit }) {
  const [markerPosition, setMarkerPosition] = useState(null); 
  const kirunaBoundsMap = L.latLngBounds(kirunaBounds);
  const icon = L.icon({
    iconUrl: pointer.iconUrl,
    iconSize: pointer.iconSize,
    iconAnchor: pointer.iconAnchor,
  });
  const iconSelected = L.icon({
    iconUrl: pointer.iconUrl,
    iconSize: pointer.iconSize,
    iconAnchor: pointer.iconAnchor,
    className: 'custom-marker-icon',
  });

  useEffect(() => {
    if (coordinates && coordinates.lat && coordinates.lng) {
      setMarkerPosition([coordinates.lat, coordinates.lng]);
    }
  }, [coordinates]);

  const handleExistingMarkerClick = (lat, lng) => {
    setMarkerPosition([lat, lng]);
    onCoordinatesChange({ lat, lng });
  };

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
        
        <MapEvents 
          edit={edit} 
          mode={mode} 
          onCoordinatesChange={onCoordinatesChange} 
          setMarkerPosition={setMarkerPosition} 
        />
        
        {existList?.map((coord, index) => (
          coord.lat && coord.lng && (
            <Marker
              key={index} 
              position={[coord.lat, coord.lng]} 
              icon={icon} 
              eventHandlers={{
                click: () => handleExistingMarkerClick(coord.lat, coord.lng),
              }}
            />
          )
        ))}

        {markerPosition && <Marker position={markerPosition} icon={iconSelected} />}
        
        {(mode === 'add' || edit) && (
          <MapMultiPolygon list={kirunaBounds}></MapMultiPolygon>
        )}
      </MapContainer>
    </div>
  );
}

MapPointSelector.propTypes = {
  onCoordinatesChange: PropTypes.func.isRequired,    // Funzione per cambiare le coordinate
  coordinates: PropTypes.shape({                      // Coordinate selezionate
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  existList: PropTypes.arrayOf(                      // Lista di coordinate esistenti
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })
  ).isRequired,
  mode: PropTypes.oneOf(['add', 'edit', 'view']).isRequired, // Modalità del componente
  edit: PropTypes.bool.isRequired,                    // Flag per la modalità di modifica
};


export default MapPointSelector;
