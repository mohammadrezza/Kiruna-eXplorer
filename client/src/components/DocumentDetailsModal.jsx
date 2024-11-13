import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import dayjs from 'dayjs';
import API from '../services/API.mjs'; // Ensure this imports your API service correctly

function DocumentDetailsModal({ show, onHide, document }) {
  const [connectedDocuments, setConnectedDocuments] = useState([]);

  useEffect(() => {
    const fetchConnectedDocuments = async () => {
      if (show && document?.id) { 
        try {
          const response = await API.get(`/api/documents/${document.id}/connected`);
          setConnectedDocuments(response.data);
        } catch (error) {
          console.error('Error fetching connected documents:', error);
        }
      }
    };

    fetchConnectedDocuments();
  }, [show, document?.id]);

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
            <p><strong>Stakeholders:</strong> {document.stakeholders}</p>
            <p><strong>Type:</strong> {document.type}</p>
            <p><strong>Pages:</strong> {document.pages}</p>
          </Col>
          <Col md={6}>
            <p><strong>Scale:</strong> {document.scale}</p>
            <p><strong>Issuance Date:</strong> {dayjs(document.issuanceDate).format('DD/MM/YYYY')}</p>
            <p><strong>Language:</strong> {document.language}</p>
          </Col>
        </Row>
        <p><strong>Description:</strong> {document.description}</p>
        
        {/* Connected documents section */}
        <hr />
        <h5>Connected Documents</h5>
        <ul>
          {connectedDocuments.length > 0 ? (
            connectedDocuments.map((connectedDoc) => (
              <li key={connectedDoc.id}>
                <p><strong>Title:</strong> {connectedDoc.title}</p>
                <p><strong>Type:</strong> {connectedDoc.type}</p>
                <p><strong>Issuance Date:</strong> {dayjs(connectedDoc.issuanceDate).format('DD/MM/YYYY')}</p>
                {/* Additional connected document details can go here */}
              </li>
            ))
          ) : (
            <p>No connected documents available.</p>
          )}
        </ul>
      </Modal.Body>
    </Modal>
  );
}

export default DocumentDetailsModal;