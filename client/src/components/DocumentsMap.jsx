import React from 'react';
import { MapContainer, TileLayer, Polygon, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useOutletContext } from 'react-router-dom';
import L from 'leaflet';
import { MapMarkers, createClusterIcon } from '@/components/DocumentsMap/MapMarkers';
import { kirunaBounds, initialMapCenter } from "@/utils/constants.js";
import { calculateCentroid } from "@/utils/geometry"; // Import the centroid function
import 'leaflet/dist/leaflet.css';
import '@/style/mapCustom.css';

const polygonsData = [
  {
    id: 1,
    coords: [
      [67.8598, 20.2092],
      [67.8522, 20.1970],
      [67.8677, 20.2439],
    ],
    name: 'Polygon 1',
  },
  {
    id: 2,
    coords: [
      [67.8608, 20.2050],
      [67.8530, 20.1900],
      [67.8685, 20.2400],
    ],
    name: 'Polygon 2',
  },
];

const DocumentMap = () => {
  const { list } = useOutletContext();
  const kirunaBoundsMap = L.latLngBounds(kirunaBounds);
  
  // Calculate centroids for each polygon
  const centroids = polygonsData.map((polygon) => {
    const centroid = calculateCentroid(polygon.coords);
    return {
      id: polygon.id,
      position: centroid,  // position of the centroid
      name: polygon.name,
    };
  });

  return (
    <div>
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
        {/* Marker Clustering for Markers */}
        <MarkerClusterGroup iconCreateFunction={createClusterIcon} maxClusterRadius={50}>
          <MapMarkers list={list} />
        </MarkerClusterGroup>

        {/* Marker Clustering for Polygons (using centroids) */}
        <MarkerClusterGroup>
          {centroids.map((centroid) => (
            <Marker key={centroid.id} position={centroid.position}>
            </Marker>
          ))}
        </MarkerClusterGroup>

        {/* Polygons */}
        {polygonsData.map((polygon) => (
          <Polygon
            key={polygon.id}
            positions={polygon.coords}
            color="blue"
            fillColor="blue"
            fillOpacity={0.5}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default DocumentMap;
