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

// AreaForm.propTypes = {
//   area: PropTypes.arrayOf(                           // L'area deve essere un array di coordinate
//     PropTypes.shape({
//       lat: PropTypes.number.isRequired,             // Latitudine obbligatoria
//       lng: PropTypes.number.isRequired,             // Longitudine obbligatoria
//     })
//   ).isRequired,
//   existList: PropTypes.arrayOf(                      // Lista di aree esistenti
//     PropTypes.shape({
//       lat: PropTypes.number.isRequired,
//       lng: PropTypes.number.isRequired,
//     })
//   ).isRequired,
//   mode: PropTypes.oneOf(['add', 'edit', 'view']).isRequired, // Modalità: 'add', 'edit', o 'view'
//   edit: PropTypes.bool.isRequired,                  // Flag per indicare se è in modalità modifica
//   onAreaChange: PropTypes.func.isRequired,          // Funzione per gestire il cambio dell'area
// };


export default AreaForm;
