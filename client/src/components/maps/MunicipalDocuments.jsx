import React from 'react';
import { Row, Col } from 'react-bootstrap';

const MunicipalDocuments = ({ municipalDocuments, showDocuments, toggleList }) => {
  return (
    <div>
      {municipalDocuments.length > 0 && (
        <div className="map-municipal-title">
          There are documents for the whole municipal. <span onClick={toggleList}>Show them</span>
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
            </Row>
          ))}
      </div>
    </div>
  );
};

export default MunicipalDocuments;
