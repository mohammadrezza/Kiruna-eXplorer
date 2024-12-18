import React from 'react';
import { Row } from 'react-bootstrap';
import MapAreaSelector from "@/components/CreateDocument/MapAreaSelector"
import PropTypes from 'prop-types';


const AreaForm = ({area, existList, mode, edit, onAreaChange}) => {
  return (
  <Row>
    <Row>
      <MapAreaSelector mode={mode} edit={edit} area={area} existList={existList} onAreaChange={onAreaChange}></MapAreaSelector>
    </Row>
  </Row>
)};

AreaForm.propTypes = {
  area: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.number)
      )
    ),
    PropTypes.array, // Allow an empty array
  ]).isRequired, // Multi-dimensional array for polygon coordinates or an empty array
  existList: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.number)
      )
    ),
    PropTypes.array, // Allow an empty array
  ]).isRequired, // Array of existing areas (nested coordinate arrays or empty array)
  mode: PropTypes.oneOf(['add', 'view']).isRequired, // Mode can only be 'add' or 'view'
  edit: PropTypes.bool, // Boolean to specify if the component is in edit mode
  onAreaChange: PropTypes.func.isRequired, // Function to handle changes to the area
};


export default AreaForm;
