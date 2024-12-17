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
            <div className="map-view-trigger" onClick={toggleMap}>
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
  coordinates: PropTypes.shape({                   // Coordinate
    lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    lng: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  existList: PropTypes.arrayOf(                    // Lista di coordinate già esistenti
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })
  ).isRequired,
  mode: PropTypes.oneOf(['add', 'edit', 'view']).isRequired, // Modalità del form
  edit: PropTypes.bool.isRequired,                 // Flag per indicare se il form è in modalità modifica
  errors: PropTypes.shape({                        // Oggetto errori
    lat: PropTypes.string,
    lng: PropTypes.string,
  }),
  onCoordinatesChange: PropTypes.func.isRequired,  // Callback per il cambio delle coordinate
  areValidCoordinates: PropTypes.func.isRequired,  // Funzione per validare le coordinate
};


export default CoordinatesForm;
