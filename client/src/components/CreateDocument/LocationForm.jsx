import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import AreaForm from "@/components/CreateDocument/AreaForm.jsx"
import CoordinatesForm from "@/components/CreateDocument/CoordinatesForm.jsx"
import { kirunaBounds } from "@/utils/constants.js";

const LocationForm = forwardRef(({coordinates, mode, edit, handleCoordinatesChange}, ref) => {
  const [selectedOption, setSelectedOption] = useState('coordinates');
  const [errors, setErrors] = useState({ lat: '', lng: '' });
  
  const options = [
    { label: 'Coordinates', value: 'coordinates' },
    { label: 'Geographical Area', value: 'area' },
  ];

  const handleOptionsChange = (e) => {
    setSelectedOption(e.target.value)
    if(e.target.value === 'area') handleCoordinatesChange({lat: '', lng: ''})
    else if(e.target.value === 'coordinates'){}
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

  return (
  <Row>
    <Row>
      <Form.Group  className='form-group' controlId="description">
        <Form.Label>Coordinates{(mode === 'add' || edit) && <span>*</span>}</Form.Label>
      </Form.Group>
    </Row>
    <Row>
      {options.map((option) => (
        <Col key={option.value} md={3}>
          <Form.Check
            type="radio"
            label={option.label}
            name="locationType"
            value={option.value}
            checked={selectedOption === option.value}
            onChange={handleOptionsChange}
          />
        </Col>
      ))}
    </Row>
    <Row>
      {selectedOption === 'coordinates' && 
        <CoordinatesForm 
          mode 
          edit 
          coordinates={coordinates}
          errors={errors}
          areValidCoordinates={areValidCoordinates}
          onCoordinatesChange={handleCoordinatesChange}
        />}
      {selectedOption === 'area' && <AreaForm mode edit/>}
    </Row>
  </Row>
)});

export default LocationForm;
