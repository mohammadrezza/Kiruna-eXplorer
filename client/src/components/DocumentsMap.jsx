import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useOutletContext } from 'react-router-dom';
import L from 'leaflet';
import { MapMarkers, MapCentroids, createClusterIcon } from '@/components/DocumentsMap/MapMarkers';
import { MapPolygon } from '@/components/DocumentsMap/MapPolygon';
import MunicipalDocuments from '@/components/DocumentsMap/MunicipalDocuments';
import { useAuth } from '@/layouts/AuthContext';
import { kirunaBounds, initialMapCenter } from "@/utils/constants.js";
import { calculateCentroid } from "@/utils/geometry"; // Import the centroid function
import 'leaflet/dist/leaflet.css';
import '@/style/mapCustom.css';

const DocumentMap = () => {
  const { list } = useOutletContext();
  const { user } = useAuth(); 
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [activeLayer, setActiveLayer] = useState('satellite');  // State to manage active layer
  const areas = list.filter(item => item.area && item.area.length > 0);
  const coordinates = list.filter(item => item.coordinates && Object.keys(item.coordinates).length > 0);
  const kirunaBoundsMap = L.latLngBounds(kirunaBounds);
  const municipalDocuments = list.filter(
    (doc) => doc.coordinates.lat === 0 && doc.coordinates.lng === 0
  );
  
  // Calculate centroids for each polygon
  const centroids = areas.map((polygon) => {
    const centroid = calculateCentroid(polygon.area);
    return {
      id: polygon.id,
      coordinates: centroid,
      name: polygon.name,
      type: polygon.type,
      title: polygon.title,
      issuanceDate: polygon.issuanceDate,
      stakeholders: polygon.stakeholders
    };
  });

  const toggleList = () => setShowDocuments((prev) => !prev);

  const handlePointClick = (pointId, marker) => {
    const polygon = areas.find(poly => poly.id === pointId);
    setSelectedPolygon(polygon || null);
    if (marker) {
      marker.openPopup();
    }
  };

  const handlePopupClose = () => {
    setSelectedPolygon(null);
  };

  return (
    <div>
      <MunicipalDocuments
        municipalDocuments={municipalDocuments}
        user={user}
        showDocuments={showDocuments}
        toggleList={toggleList}
      />
      <div className='map-custom'>
      <MapContainer
        center={initialMapCenter}
        zoom={13}
        minZoom={9}
        maxZoom={17}
        style={{ height: '100vh', width: '100%' }}
        maxBounds={kirunaBoundsMap}
        maxBoundsViscosity={1.0}
      >
        {/* TileLayer for different views */}
        {activeLayer === 'satellite' && (
          <TileLayer
            url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
            attribution="&copy; <a href='https://www.google.com/intl/en_us/help/terms_maps.html'>Google Maps</a>"
          />
        )}
        {activeLayer === 'streets' && (
          <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        )}
        
        <MarkerClusterGroup iconCreateFunction={createClusterIcon} maxClusterRadius={50}>
          <MapMarkers list={coordinates} user={user} />
          <MapCentroids 
            list={centroids}
            user={user}
            handlePointClick={handlePointClick} 
            handlePopupClose={handlePopupClose}
          />
        </MarkerClusterGroup>
        
        {selectedPolygon && (
          <MapPolygon
            list={[selectedPolygon]}
          />
        )}
      </MapContainer>

      {/* Buttons or Controls for Switching Views */}
      <div className="map-layer-switch">
        {activeLayer === 'streets' && (<button onClick={() => setActiveLayer('satellite')}>Satellite View</button>)}
        {activeLayer === 'satellite' && (<button onClick={() => setActiveLayer('streets')}>Street View</button>)}
      </div>
      </div>
    </div>
  );
};

export default DocumentMap;
