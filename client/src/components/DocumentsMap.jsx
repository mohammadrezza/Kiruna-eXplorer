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

const DocumentMap = () => {
  const { list } = useOutletContext();
  const areas = list.filter(item => item.area && item.area.length > 0);
  const coordinates = list.filter(item => item.coordinates && Object.keys(item.coordinates).length > 0);
  const kirunaBoundsMap = L.latLngBounds(kirunaBounds);
  // Calculate centroids for each polygon
  const centroids = areas.map((polygon) => {
    const centroid = calculateCentroid(polygon.area);
    return {
      id: polygon.id,
      position: centroid,  // position of the centroid
      name: polygon.name,
    };
  });
  console.log('centroids', centroids)

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
          <MapMarkers list={coordinates} />
        </MarkerClusterGroup>

        {/* Marker Clustering for Polygons (using centroids) */}
        <MarkerClusterGroup>
          {centroids.map((centroid) => (
            <Marker key={centroid.id} position={centroid.position}>
            </Marker>
          ))}
        </MarkerClusterGroup>

        {/* Polygons */}
        {areas.map((polygon) => (
          <Polygon
            key={polygon.id}
            positions={polygon.area}
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
