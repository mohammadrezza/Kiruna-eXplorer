import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import L from 'leaflet';
import AreaForm from "@/components/CreateDocument/AreaForm.jsx";
import CoordinatesForm from "@/components/CreateDocument/CoordinatesForm.jsx";
import { kirunaBounds } from "@/utils/constants.js";

const LocationForm = forwardRef(({ coordinates, area, mode, edit, handleCoordinatesChange, handleAreaChange }, ref) => {
  const [selectedOption, setSelectedOption] = useState('coordinates');
  const [errors, setErrors] = useState({ lat: '', lng: '' });

  const options = [
    { label: 'Coordinates', value: 'coordinates' },
    { label: 'Geographical Area', value: 'area' },
    { label: 'Whole municipal', value: 'municipal' },
  ];

  const isEditable = mode === 'add' || edit;
  
  const filteredOptions = useMemo(() => {
    return isEditable ? options : options.filter(option => option.value === selectedOption);
  }, [isEditable, selectedOption]);

  const handleOptionsChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    if (selectedValue === 'area') {
      handleCoordinatesChange({});
    } else if (selectedValue === 'coordinates') {
      handleCoordinatesChange({});
      handleAreaChange([]);
    } else if (selectedValue === 'municipal') {
      handleCoordinatesChange({lat: 0, lng: 0});
      handleAreaChange([]);
    }
  };

  const insidePolygon = (coordinates) => {
    if(coordinates.lat === 0 || coordinates.lng === 0) return true
    const point = L.latLng(coordinates.lat, coordinates.lng);
    
    // Check if point is inside any polygon in kirunaBounds
    const isInsidePolygon = kirunaBounds.some(polygon => {
      const leafletPolygon = L.polygon(polygon);
      return leafletPolygon.getBounds().contains(point);
    });

    // If not inside a polygon, show error
    if (!isInsidePolygon) {
      setErrors({
        lat: 'Latitude out of bounds',
        lng: 'Longitude out of bounds',
      });
      return false;
    }
    return true;
  };

  const areValidCoordinates = (coordinates) => {
  // Regular expression to validate if coordinates are in valid format
  const latIsValid = /^-?\d*\.?\d*$/.test(coordinates.lat);
  const lngIsValid = /^-?\d*\.?\d*$/.test(coordinates.lng);

  if (!latIsValid || !lngIsValid) {
    setErrors({
      lat: 'Invalid latitude format',
      lng: 'Invalid longitude format',
    });
    return false;
  }

  // Check if coordinates are inside valid polygon
  return insidePolygon(coordinates);
};;

  useImperativeHandle(ref, () => ({
    areValidCoordinates,
  }));

  useEffect(() => {
    if (mode === 'view' || edit) {
      if (coordinates.lat === 0 && coordinates.lng === 0) {
        setSelectedOption('municipal');
      }
      else setSelectedOption(Array.isArray(area) && area.length === 0 ? 'coordinates' : 'area');
    }
  }, [mode, edit, area]);

  return (
    <Row>
      <Form.Group className='form-group' controlId="description">
        <Form.Label>Coordinates{(mode === 'add' || edit) && <span>*</span>}</Form.Label>
      </Form.Group>

      <Row>
        {filteredOptions.map(({ label, value }) => (
          <Col key={value} md={3}>
            <Form.Check
              type="radio"
              label={label}
              name="locationType"
              value={value}
              checked={selectedOption === value}
              onChange={handleOptionsChange}
            />
          </Col>
        ))}
      </Row>

      <Row>
        {selectedOption === 'coordinates' && (
          <CoordinatesForm 
            mode={mode}
            edit={edit}
            coordinates={coordinates}
            errors={errors}
            areValidCoordinates={areValidCoordinates}
            onCoordinatesChange={handleCoordinatesChange}
          />
        )}

        {selectedOption === 'area' && (
          <AreaForm 
            mode={mode}
            edit={edit}
            area={area}
            onAreaChange={handleAreaChange}
          />
        )}
      </Row>
    </Row>
  );
});

export default LocationForm;
