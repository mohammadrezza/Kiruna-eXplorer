import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import L from 'leaflet';
import AreaForm from "@/components/CreateDocument/AreaForm.jsx";
import CoordinatesForm from "@/components/CreateDocument/CoordinatesForm.jsx";
import { kirunaBounds } from "@/utils/constants.js";
import API from '@/services/API.mjs';
import PropTypes from 'prop-types';


const LocationForm = forwardRef(({ coordinates, area, mode, edit, handleCoordinatesChange, handleAreaChange }, ref) => {
  const [selectedOption, setSelectedOption] = useState('coordinates');
  const [errors, setErrors] = useState({ lat: '', lng: '' });
  const [uniqueCoordinates, setUniqueCoordinates] = useState([]);
  const [uniqueAreas, setUniqueAreas] = useState([]);
  

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

  const fetchUniqueData = async () => {
  try {
    const documents = await API.getList({}, 0, '', '', '');

    // Filter and extract unique coordinates with validation
    const uniqCoordinates = Array.from(
      new Set(
        documents.data
          .filter(doc => 
            doc.coordinates?.lat && 
            doc.coordinates?.lng && 
            doc.coordinates.lat !== '' && doc.coordinates.lng !== '' && 
            doc.coordinates.lat !== 0 && doc.coordinates.lng !== 0
          )
          .map(doc => JSON.stringify(doc.coordinates)) // Serialize to string for uniqueness
      )
    ).map(coords => JSON.parse(coords)); // Deserialize back to object

    // Filter and extract unique areas (ignoring empty areas)
    const uniqAreas = Array.from(
      new Set(
        documents.data
          .filter(doc => doc.area && Array.isArray(doc.area) && doc.area.length > 0) // Ensure area is not empty
          .map(doc => JSON.stringify(doc.area)) // Serialize for uniqueness
      )
    ).map(area => JSON.parse(area)); // Deserialize back to object/array

    setUniqueCoordinates(uniqCoordinates)
    setUniqueAreas(uniqAreas)
    return { uniqueCoordinates, uniqueAreas };
  } catch (error) {
    console.error("Error fetching unique data:", error);
    return { uniqueCoordinates: [], uniqueAreas: [] };
  }
  };

  useEffect(() => {
    fetchUniqueData();
  }, []);

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
            existList={uniqueCoordinates}
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
            existList={uniqueAreas}
            onAreaChange={handleAreaChange}
          />
        )}
      </Row>
    </Row>
  );
});

LocationForm.propTypes = {
  coordinates: PropTypes.oneOfType([
    PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
    PropTypes.object, // Allow an empty object
  ]), // Object containing latitude and longitude or an empty object
  area: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.number)
      )
    ),
    PropTypes.array, // Allow an empty array
  ]), // Multi-dimensional array for polygon coordinates or an empty array
  mode: PropTypes.oneOf(['add', 'view']).isRequired, // Mode can only be 'add' or 'view'
  edit: PropTypes.bool, // Boolean to specify if the component is in edit mode
  handleCoordinatesChange: PropTypes.func.isRequired, // Function to handle changes to coordinates
  handleAreaChange: PropTypes.func.isRequired, // Function to handle changes to the area
};


export default LocationForm;
