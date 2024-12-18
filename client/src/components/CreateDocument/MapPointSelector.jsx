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

MapEvents.propTypes = {
  onCoordinatesChange: PropTypes.func.isRequired,    // Funzione per cambiare le coordinate
  setMarkerPosition: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit', 'view']).isRequired, // Modalità del componente
  edit: PropTypes.bool.isRequired,                    // Flag per la modalità di modifica
};


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
  const isEditable = mode === 'add' || edit;

  useEffect(() => {
    if (coordinates?.lat && coordinates?.lng) {
      setMarkerPosition([coordinates.lat, coordinates.lng]);
    }
  }, [coordinates]);

  const handleExistingMarkerClick = (lat, lng) => {
    setMarkerPosition([lat, lng]);
    onCoordinatesChange({ lat, lng });
  };

  return (
    <div>
      {(isEditable) && (
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
        
        {isEditable && existList && existList.length > 0 && existList.map((coord, index) => (
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
        
        {(isEditable) && (
          <MapMultiPolygon list={kirunaBounds}></MapMultiPolygon>
        )}
      </MapContainer>
    </div>
  );
}

MapPointSelector.propTypes = {
  coordinates: PropTypes.oneOfType([
    PropTypes.shape({
      lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      lng: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    PropTypes.object, // Allows an empty object {}
  ]), // Coordinates can be a lat/lng object or an empty object
  existList: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        lng: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      })
    ),
    PropTypes.array, // Allow an empty array
  ]).isRequired, // Array of existing coordinates or empty array
  mode: PropTypes.oneOf(['add', 'view']).isRequired, // Mode can be 'add' or 'view'
  edit: PropTypes.bool, // Boolean to specify if the component is in edit mode
  onCoordinatesChange: PropTypes.func.isRequired, // Function to handle changes to the coordinates
};

export default MapPointSelector;
