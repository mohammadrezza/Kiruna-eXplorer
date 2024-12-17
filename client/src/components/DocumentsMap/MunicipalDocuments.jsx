import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';


const MunicipalDocuments = ({ municipalDocuments, showDocuments, toggleList }) => {
  const navigate = useNavigate();
  const handleDocumentClick = (documentId) => navigate(`/document/view/${documentId}`);
  return (
    <div>
      {municipalDocuments.length > 0 && (
        <div className="map-municipal-title">
          There are documents for the whole municipal. <span onClick={toggleList}>
            {!showDocuments ? 'Show them' : 'Hide'}
          </span>
        </div>
      )}
      <div className="map-municipal-list">
        {municipalDocuments.length > 0 && showDocuments &&
          municipalDocuments.map((doc) => (
            <Row key={doc.id}>
              <Col>{doc.title}</Col>
              <Col>Type: {doc.type}</Col>
              <Col>Stakeholders: {doc.stakeholders}</Col>
              <Col>Issuance Date: {doc.issuanceDate}</Col>
              <Col className="custom-marker-popup-link" onClick={() => handleDocumentClick(doc.id)}>Open the document</Col>
            </Row>
          ))}
      </div>
    </div>
  );
};

MunicipalDocuments.propTypes = {
  municipalDocuments: PropTypes.arrayOf(  // Array di documenti
    PropTypes.shape({
      id: PropTypes.string.isRequired,    // ID del documento
      title: PropTypes.string.isRequired, // Titolo del documento
      type: PropTypes.string.isRequired,  // Tipo del documento
      stakeholders: PropTypes.string.isRequired, // Stakeholders del documento
      issuanceDate: PropTypes.string.isRequired, // Data di emissione del documento
    })
  ).isRequired,
  showDocuments: PropTypes.bool.isRequired,    // Flag per mostrare/nascondere i documenti
  toggleList: PropTypes.func.isRequired,       // Funzione per alternare la visibilità dei documenti
};


export default MunicipalDocuments;