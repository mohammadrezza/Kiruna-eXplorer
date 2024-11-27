import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useOutletContext } from 'react-router-dom';
import L from 'leaflet';
import MunicipalDocuments from '@/components/maps/MunicipalDocuments';
import {MapMarkers, createClusterIcon} from '@/components/maps/MapMarkers';
import 'leaflet/dist/leaflet.css';
import '@/style/mapCustom.css';

const DocumentMap = () => {
  const { list } = useOutletContext();
  const [showDocuments, setShowDocuments] = useState(false);
  
  const kirunaCenter = [67.8558, 20.2253];
  const kirunaBounds = L.latLngBounds([67.765, 20.090], [67.900, 20.420]);
  
  const municipalDocuments = list.filter(
    (doc) => doc.coordinates.lat === 0 && doc.coordinates.lng === 0
  );

  const toggleList = () => setShowDocuments((prev) => !prev);

  return (
    <div>
      <MunicipalDocuments
        municipalDocuments={municipalDocuments}
        showDocuments={showDocuments}
        toggleList={toggleList}
      />
      <MapContainer
        center={kirunaCenter}
        zoom={13}
        minZoom={11}
        maxZoom={17}
        style={{ height: '100vh', width: '100%' }}
        maxBounds={kirunaBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <MarkerClusterGroup iconCreateFunction={createClusterIcon} maxClusterRadius={50}>
          <MapMarkers list={list} />
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default DocumentMap;
