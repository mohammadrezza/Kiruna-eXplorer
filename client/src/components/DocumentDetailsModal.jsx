import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import '../style/DocumentDetailsModal.css';

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
            <p><strong>Pages:</strong> {document.pages}</p>
          </Col>
          <Col md={6}>
            <p><strong>Scale:</strong> {document.scale}</p>
            <p><strong>Issuance Date:</strong> {document.issuanceDate}</p>
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

export default DocumentDetailsModal;