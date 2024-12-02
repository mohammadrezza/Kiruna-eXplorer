import React from "react";
import {Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export const MapMultiPolygon = ({list}) => {
  return (
      list.map((multiPolygon, multiIndex) =>
        multiPolygon.map((polygon, polyIndex) => (
          <Polygon
            key={`${multiIndex}-${polyIndex}`}
            positions={polygon}
            color="orange"
            fillOpacity={0.1}
          />
        ))
      )
  );
};

