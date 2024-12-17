import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon, Marker } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import { kirunaBounds, initialMapCenter } from "@/utils/constants.js";
import { createClusterIcon } from '@/components/DocumentsMap/MapMarkers';
import { MapMultiPolygon } from '@/components/DocumentsMap/MapMultiPolygon';
import { calculateCentroid } from "@/utils/geometry";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import PropTypes from 'prop-types';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapAreaSelector = ({ area, existList, mode, edit, onAreaChange }) => {
  const [polygon, setPolygon] = useState([]); // Current selected polygon
  const mapRef = useRef(null);
  const featureGroupRef = useRef(null); // Reference to FeatureGroup for editing

  // Handle polygon creation
  const handleCreated = (e) => {
    if (polygon.length > 0) {
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
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers(); // Clears all layers in the FeatureGroup
    }
    setPolygon([]); // Clear polygon
    onAreaChange([]); // Notify parent to reset area
  };

  // Handle polygon editing
  const handleEdited = (e) => {
    const editedCoords = e.layers.getLayers()[0].getLatLngs()[0].map((coord) => ({
      lat: coord.lat,
      lng: coord.lng,
    }));
    const convertedCoordinates = editedCoords.map(coord => [coord.lat, coord.lng]);
    onAreaChange(convertedCoordinates);
  };

  // Handle polygon selection from existing list
  const handlePolygonClick = (selectedArea) => {
    const convertedCoordinates = selectedArea.map(coord => [coord[0], coord[1]]);
    setPolygon(selectedArea); // Update the current polygon
    onAreaChange(convertedCoordinates); // Notify parent of the change
  };

  const isEditable = mode === 'add' || edit;

  // Set the initial polygon if area exists
  useEffect(() => {
    if (area && area.length) {
      setPolygon(area); // Set the polygon based on the existing area
    }
  }, [area]);

  useEffect(() => {
    if (polygon.length > 0 && featureGroupRef.current) {
      // Add the polygon to the FeatureGroup as a Leaflet layer
      const leafletPolygon = L.polygon(polygon);
      featureGroupRef.current.clearLayers(); // Clear any existing layers
      featureGroupRef.current.addLayer(leafletPolygon); // Add the existing polygon as a layer
    }
  }, [polygon, isEditable]);

  // Add a key prop to force EditControl to re-render when polygon changes
  const editControlKey = polygon.length ? 'editable' : 'draw';

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
              key={editControlKey} // This forces the EditControl to re-render
              position="topright"
              onCreated={handleCreated}
              onDeleted={handleDeleted}
              onEdited={handleEdited}
              draw={{
                polygon: polygon.length === 0, // Allow drawing if no polygon exists
                polyline: false,
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
              }}
              edit={{
                edit: polygon.length > 0, // Allow editing if a polygon exists
                remove: polygon.length > 0, // Allow removal if a polygon exists
              }}
            />
          </FeatureGroup>
        )}

        {/* Show existing areas with clustering */}
        {existList && existList.length > 0 && (
          <MarkerClusterGroup iconCreateFunction={createClusterIcon} maxClusterRadius={50}>
            {existList.map((existingArea, index) => {
              const centroid = calculateCentroid(existingArea);

              return (
                <React.Fragment key={index}>
                  {/* Display Polygon */}
                  <Polygon
                    positions={existingArea}
                    color="green"
                    fillColor="green"
                    fillOpacity={0.3}
                  >
                  </Polygon>

                  {/* Display Centroid (Marker or Circle) */}
                  <Marker
                    position={centroid}
                    eventHandlers={{
                      click: () => handlePolygonClick(existingArea),
                    }}
                  >
                  </Marker>
                </React.Fragment>
              );
            })}
          </MarkerClusterGroup>
        )}

        {polygon && mode === 'view' && !edit && (
          <Polygon
            positions={polygon}
            color="blue"
            fillColor="blue"
            fillOpacity={0.5}
          />
        )}
        {(mode === 'add' || edit) && (
          <MapMultiPolygon list={kirunaBounds}></MapMultiPolygon>
        )}
      </MapContainer>
    </div>
  );
};

MapAreaSelector.propTypes = {
  area: PropTypes.arrayOf(                        // Area corrente
    PropTypes.arrayOf(PropTypes.number.isRequired) // Ogni punto è un array [lat, lng]
  ).isRequired,
  existList: PropTypes.arrayOf(                   // Lista di aree esistenti
    PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.number.isRequired)
    )
  ).isRequired,
  mode: PropTypes.oneOf(['add', 'edit', 'view']).isRequired, // Modalità del componente
  edit: PropTypes.bool.isRequired,                // Flag per la modalità di modifica
  onAreaChange: PropTypes.func.isRequired,        // Callback per aggiornare l'area
};


export default MapAreaSelector;
