import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import AreaForm from "@/components/CreateDocument/AreaForm.jsx";
import CoordinatesForm from "@/components/CreateDocument/CoordinatesForm.jsx";
import { kirunaBounds } from "@/utils/constants.js";

const LocationForm = forwardRef(({ coordinates, area, mode, edit, handleCoordinatesChange, handleAreaChange }, ref) => {
  const [selectedOption, setSelectedOption] = useState('coordinates');
  const [errors, setErrors] = useState({ lat: '', lng: '' });

  const options = [
    { label: 'Coordinates', value: 'coordinates' },
    { label: 'Geographical Area', value: 'area' },
  ];

  const isEditable = mode === 'add' || edit;
  
  const filteredOptions = useMemo(() => {
    return isEditable ? options : options.filter(option => option.value === selectedOption);
  }, [isEditable, selectedOption]);

  const handleOptionsChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    if (selectedValue === 'area') {
      handleCoordinatesChange({ lat: '', lng: '' });
    } else if (selectedValue === 'coordinates') {
      handleAreaChange([]);
    }
  };

  const areValidCoordinates = (coordinates) => {
    const [sw, ne] = kirunaBounds;
    const isValidLat = coordinates.lat >= sw[0] && coordinates.lat <= ne[0];
    const isValidLng = coordinates.lng >= sw[1] && coordinates.lng <= ne[1];

    const latIsValid = /^-?\d*\.?\d*$/.test(coordinates.lat) && isValidLat;
    const lngIsValid = /^-?\d*\.?\d*$/.test(coordinates.lng) && isValidLng;
    
    setErrors({
      lat: latIsValid ? '' : 'Invalid latitude, should be between 67.765 and 67.900',
      lng: lngIsValid ? '' : 'Invalid longitude, should be between 20.090 and 20.420'
    });
    
    return latIsValid && lngIsValid;
  };

  useImperativeHandle(ref, () => ({
    areValidCoordinates,
  }));

  useEffect(() => {
    if (mode === 'view' || edit) {
      setSelectedOption(Array.isArray(area) && area.length === 0 ? 'coordinates' : 'area');
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
