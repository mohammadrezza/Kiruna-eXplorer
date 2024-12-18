import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { PiMapPinSimpleAreaFill, PiPen } from "react-icons/pi";
import MapPointSelector from "@/components/CreateDocument/MapPointSelector"
import PropTypes from 'prop-types';

const SelectMapBtn = () => (
  <><PiMapPinSimpleAreaFill /><span>Select on map</span></>
);
const SelectTypeBtn = () => (
  <><PiPen /><span>Type coordinates</span></>
);

const CoordinatesForm = ({coordinates,existList,  mode, edit, errors,  onCoordinatesChange, areValidCoordinates}) => {
  const [showMap, setShowMap] = useState(false);
  const [locationData, setLocationData] = useState(coordinates);

  const handleCoordinatesChange = (newCoordinates) => {
    setLocationData(newCoordinates);
    onCoordinatesChange(newCoordinates);
  };

  const toggleMap = () => {
    if (Object.keys(coordinates).length === 0  || (locationData.lat ===  '' && locationData.lng === '') || areValidCoordinates(locationData)) {
      setShowMap(prev => !prev);
    }
  };
  useEffect(() => {
    setLocationData(coordinates);
  }, [coordinates]);

  return (
    <>
      <Row>
        <Col md={4}>
          <Form.Group className="form-group">
            <Form.Control 
              type="text" 
              placeholder="latitude (e.g., 67.8558)" 
              minLength={2} 
              value={locationData.lat} 
              onChange={(event) => handleCoordinatesChange({lat: event.target.value, lng: locationData.lng})}
              readOnly={(!edit && mode !== 'add') || showMap}
              isInvalid={!!errors.lat} // Show invalid state if there is an error
            />
            <Form.Control.Feedback type="invalid">
              {errors.lat}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="form-group">
            <Form.Control 
              type="text" 
              placeholder="longitude (e.g., 20.2253)"
              minLength={2} 
              value={locationData.lng} 
              onChange={(event) => handleCoordinatesChange({lat: locationData.lat, lng: event.target.value})}
              readOnly={(!edit && mode !== 'add') || showMap}
              isInvalid={!!errors.lng} // Show invalid state if there is an error
            />
            <Form.Control.Feedback type="invalid">
              {errors.lng}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          {(mode === 'add' || edit) && (
            <div className="map-view-trigger" role="button" tabIndex="0"  onClick={toggleMap}>
              {showMap ? <SelectTypeBtn /> : <SelectMapBtn />}
            </div>
          )}
        </Col>
      </Row>
      <Row>
        {(showMap || (mode !== 'add' && !edit)) && 
          <MapPointSelector 
            coordinates={locationData}
            mode={mode}
            edit={edit}
            existList={existList}
            onCoordinatesChange={handleCoordinatesChange} 
          />
        }
      </Row>
    </>
  );
};

CoordinatesForm.propTypes = {
  coordinates: PropTypes.oneOfType([
    PropTypes.shape({
      lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      lng: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    PropTypes.object, // Allows an empty object {}
  ]), // Coordinates can be a lat/lng object or an empty object
  existList: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        lng: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      })
    ),
    PropTypes.array, // Allow an empty array
  ]).isRequired, // Array of existing coordinates or empty array
  mode: PropTypes.oneOf(['add', 'view']).isRequired, // Mode can be 'add' or 'view'
  edit: PropTypes.bool, // Boolean to specify if the component is in edit mode
  errors: PropTypes.shape({
    lat: PropTypes.string, // Latitude error message, if any
    lng: PropTypes.string, // Longitude error message, if any
  }).isRequired, // Errors object for validation feedback
  onCoordinatesChange: PropTypes.func.isRequired, // Function to handle changes to the coordinates
  areValidCoordinates: PropTypes.func.isRequired, // Function to validate coordinates
};




export default CoordinatesForm;
