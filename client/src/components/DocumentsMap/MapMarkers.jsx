import React from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { iconData } from '@/utils/mapIcons';
import {showDate} from "@/utils/formatDate.js"

const getIcons = (type = 'coordinates') => {
  const icons = {};
  iconData.forEach(({ name, iconUrl, iconSize, iconAnchor }) => {
    icons[name] = L.icon({
      iconUrl,
      iconSize,
      iconAnchor,
      className: type === 'area' ? 'custom-area-icon' : 'custom-marker-icon',
    });
  });
  return icons;
};

const MapMarkers = ({ list, user }) => {
  const icons = getIcons();
  const navigate = useNavigate();
  const handleDocumentClick = (documentId) => navigate(`/document/view/${documentId}`);
  return list.map((doc) => {
    const { lat, lng } = doc.coordinates;
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;
    const icon = icons[doc.type] || icons['default'];
    return (
      <Marker key={doc.id} position={[parseFloat(lat), parseFloat(lng)]} icon={icon}>
        <Popup className="custom-marker-popup">
          <strong>{doc.title}</strong>
          <p><strong>Type:</strong> {doc.type}</p>
          <p><strong>Stakeholders:</strong> {doc.stakeholders}</p>
          <p><strong>Issuance Date:</strong> {showDate(doc.issuanceDate)}</p>
          {user && <p className="custom-marker-popup-link" onClick={() => handleDocumentClick(doc.id)}>Open the document</p>}
        </Popup>
        <Tooltip direction="top" offset={[0, -32]} opacity={1}>
          <span>{doc.title}</span>
        </Tooltip>
      </Marker>
    );
  });
};

const MapCentroids = ({ list, user, handlePointClick, handlePopupClose }) => {
  const icons = getIcons('area');
  const navigate = useNavigate();
  const handleDocumentClick = (documentId) => navigate(`/document/view/${documentId}`);
  return list.map((doc) => {
    const { lat, lng } = doc.coordinates;
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;
    const icon = icons[doc.type] || icons['default'];
    return (
      <Marker 
        key={doc.id} 
        position={[parseFloat(lat), parseFloat(lng)]} 
        icon={icon}
        eventHandlers={{
            popupclose: handlePopupClose,
        }}>
        <Popup className="custom-marker-popup">
          <strong>{doc.title}</strong>
          <p><strong>Type:</strong> {doc.type}</p>
          <p><strong>Stakeholders:</strong> {doc.stakeholders}</p>
          <p><strong>Issuance Date:</strong> {showDate(doc.issuanceDate)}</p>
          {user && <p className="custom-marker-popup-link" onClick={() => handleDocumentClick(doc.id)}>Open the document</p>}
          <p className="custom-marker-popup-link" onClick={() => handlePointClick(doc.id)}>Show the area</p>
        </Popup>
        <Tooltip direction="top" offset={[0, -32]} opacity={1}>
          <span>{doc.title}</span>
        </Tooltip>
      </Marker>
    );
  });
};

const createClusterIcon = (cluster) => {
  const markersCount = cluster.getChildCount();
  return L.divIcon({
    html: `<div class="cluster-icon">${markersCount}</div>`,
    className: 'custom-cluster-icon',
    iconSize: new L.Point(40, 40),
  });
};

export  {MapMarkers, createClusterIcon, MapCentroids};
