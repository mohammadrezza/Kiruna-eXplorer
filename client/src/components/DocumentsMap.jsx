import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useOutletContext } from 'react-router-dom';
import L from 'leaflet';
import MunicipalDocuments from '@/components/DocumentsMap/MunicipalDocuments';
import {MapMarkers, createClusterIcon} from '@/components/DocumentsMap/MapMarkers';
import { kirunaBounds, initialMapCenter } from "@/utils/constants.js";
import 'leaflet/dist/leaflet.css';
import '@/style/mapCustom.css';

const DocumentMap = () => {
  const { list } = useOutletContext();
  const [showDocuments, setShowDocuments] = useState(false);
  
  const kirunaBoundsMap = L.latLngBounds(kirunaBounds);
  
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
        center={initialMapCenter}
        zoom={13}
        minZoom={11}
        maxZoom={17}
        style={{ height: '100vh', width: '100%' }}
        maxBounds={kirunaBoundsMap}
        maxBoundsViscosity={1.0}
      >
        <TileLayer url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        />
        <MarkerClusterGroup iconCreateFunction={createClusterIcon} maxClusterRadius={50}>
          <MapMarkers list={list} />
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default DocumentMap;
