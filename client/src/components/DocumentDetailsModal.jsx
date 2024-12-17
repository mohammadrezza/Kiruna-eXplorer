import React from 'react';
import { Modal, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../style/DocumentDetailsModal.css';
import PropTypes from 'prop-types';

function DocumentDetailsModal({ show, onHide, document }) {
  const navigate = useNavigate();
  const handleDocumentClick = (documentId) => navigate(`/document/view/${documentId}`);

  if (!document) return null;

  // Aggrega i tipi di connessione per ogni documento
  const aggregatedConnections = document.connections.reduce((acc, doc) => {
    // Trova il documento esistente, o creane uno nuovo
    const existingDoc = acc.find((item) => item.id === doc.id);
    if (existingDoc) {
      // Se il documento esiste, aggiungi il tipo di connessione
      if (!existingDoc.connectionTypes.includes(doc.connectionType)) {
        existingDoc.connectionTypes.push(doc.connectionType);
      }
    } else {
      // Se il documento non esiste, aggiungilo con il tipo di connessione
      acc.push({
        ...doc,
        connectionTypes: [doc.connectionType],
      });
    }
    return acc;
  }, []);

  if (!document) return null;

  const showDate = (issuanceDate) =>{
    const [dd, mm, yyyy] = issuanceDate.split("-");
    let realDate = '';
    realDate = realDate.concat((dd!=='00'?`${dd}-`:''),(mm!=='00'?`${mm}-`:''),yyyy)
    return realDate;
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header>
        <Modal.Title>{document.title}</Modal.Title>
        <Button variant="close" onClick={onHide} aria-label="Close" />
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={6}>
            <p><strong>Stakeholders:</strong> {document.stakeholders.join(', ')}</p>
            <p><strong>Type:</strong> {document.type}</p>
            <p><strong>Pages:</strong> {document.pages || "-"}</p>
          </Col>
          <Col md={6}>
            <p><strong>Scale:</strong> {document.scale}</p>
            <p><strong>Issuance Date:</strong> {showDate(document.issuanceDate)}</p>
            <p><strong>Language:</strong> {document.language}</p>
          </Col>
        </Row>
        <p><strong>Description:</strong> {document.description}</p>
        
        {/* Connected documents section */}
        <hr />
        <h5>Connected Documents</h5>
        <ul>
          {aggregatedConnections.length > 0 ? (
            <div className="document-list">
              <ListGroup className="related">
                <ListGroup.Item className="related-header">
                  <Row>
                    <Col md={3}>Title</Col>
                    <Col md={3}>Stakeholders</Col>
                    <Col md={2}>Type</Col>
                    <Col>Connection Types</Col>
                  </Row>
                </ListGroup.Item>
                {aggregatedConnections.map((doc) => (
                  <ListGroup.Item key={doc.id}>
                    <Row className="align-items-center">
                      <Col md={3} className="doc-title" onClick={() => handleDocumentClick(doc.id)}>{doc.title}</Col>
                      <Col md={3}>{doc.stakeholders.join(', ')}</Col>
                      <Col md={2}>{doc.type}</Col>
                      <Col>
                        {/* Visualizza i tipi di connessione separati da virgola */}
                        {doc.connectionTypes.join(', ')}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          ) : (
            <p>No connected documents available.</p>
          )}
        </ul>
      </Modal.Body>
    </Modal>
  );
}

DocumentDetailsModal.propTypes = {
  show: PropTypes.bool.isRequired,                  // Mostra o nasconde il modal
  onHide: PropTypes.func.isRequired,                // Funzione per chiudere il modal
  document: PropTypes.shape({                       // Oggetto documenti
    id: PropTypes.string.isRequired,                // ID del documento
    title: PropTypes.string.isRequired,             // Titolo del documento
    stakeholders: PropTypes.arrayOf(PropTypes.string).isRequired, // Stakeholders
    type: PropTypes.string.isRequired,              // Tipo del documento
    pages: PropTypes.string,                        // Numero di pagine
    scale: PropTypes.string,                        // Scala del documento
    issuanceDate: PropTypes.string.isRequired,      // Data di emissione
    language: PropTypes.string.isRequired,          // Lingua del documento
    description: PropTypes.string.isRequired,       // Descrizione del documento
    connections: PropTypes.arrayOf(                 // Documenti correlati
      PropTypes.shape({
        id: PropTypes.string.isRequired,            // ID del documento collegato
        title: PropTypes.string.isRequired,         // Titolo del documento collegato
        stakeholders: PropTypes.arrayOf(PropTypes.string).isRequired, // Stakeholders del documento collegato
        type: PropTypes.string.isRequired,          // Tipo del documento collegato
        connectionType: PropTypes.string.isRequired, // Tipo di connessione
      })
    ).isRequired, 
  }).isRequired,
};


export default DocumentDetailsModal;