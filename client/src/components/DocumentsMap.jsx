import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import {iconData} from '../utils/mapIcons.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../style/mapCustom.css'

const getIcons = () => {
  const icons = {};
  iconData.forEach(({ name, iconUrl, iconSize, iconAnchor }) => {
    icons[name] = L.icon({
      iconUrl,
      iconSize,
      iconAnchor,
      className: 'custom-marker-icon'
    });
  });
  return icons;
};
const createClusterIcon = (cluster) => {
  const markersCount = cluster.getChildCount();
  return L.divIcon({
    html: `<div class="cluster-icon">${markersCount}</div>`,
    className: 'custom-cluster-icon',
    iconSize: new L.Point(40, 40),
  });
};
const icons = getIcons();
const DocumentMap = ({ documents }) => {
    const kirunaBounds = L.latLngBounds(
    [67.821, 20.216],
    [67.865, 20.337] 
  );
  return (
    <MapContainer
      center={[67.8558, 20.2253]} 
      zoom={13}
      minZoom={11}
      maxZoom={17}
      style={{ height: '100vh', width: '100%' }}
      maxBounds={kirunaBounds} 
      maxBoundsViscosity={1.0} 
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup iconCreateFunction={createClusterIcon} maxClusterRadius={50}>
        {documents.map((doc) => {
            const { lat, lng } = doc.coordinates;
            if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;
            const icon = icons[doc.type];
            return (
            <Marker key={doc.id} position={[parseFloat(lat), parseFloat(lng)]} icon={icon}>
                <Popup>
                <strong>{doc.title}</strong>
                <p><strong>Type:</strong> {doc.type}</p>
                <p><strong>Stakeholders:</strong> {doc.stakeholders}</p>
                <p><strong>Issuance Date:</strong> {doc.issuanceDate}</p>
                <p><i>Open document</i></p>
                </Popup>
            </Marker>
            );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default DocumentMap;
