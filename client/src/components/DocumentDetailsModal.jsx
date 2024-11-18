import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import dayjs from 'dayjs';
import { ListGroup } from 'react-bootstrap';
import '../style/DocumentDetailsModal.css'
function DocumentDetailsModal({ show, onHide, document }) {

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
            <p><strong>Issuance Date:</strong> {dayjs(document.issuanceDate).format('DD/MM/YYYY')}</p>
            <p><strong>Language:</strong> {document.language}</p>
          </Col>
        </Row>
        <p><strong>Description:</strong> {document.description}</p>
        
        {/* Connected documents section */}
        <hr />
        <h5>Connected Documents</h5>
        <ul>
          {document.connections.length > 0 ? (
            <div className="document-list">
              <ListGroup className='related'>
                <ListGroup.Item className='related-header'>
                  <Row>
                    <Col md={3}>Title</Col>
                    <Col md={3}>Stakeholders</Col>
                    <Col md={2}>Type</Col>
                    <Col>Connection type</Col>
                  </Row>
                </ListGroup.Item>
                {document.connections.map((doc) => (
                  <ListGroup.Item key={doc.id} >
                    <Row className="align-items-center">
                      <Col md={3}>{doc.title}</Col>
                      <Col md={3}>{doc.stakeholders.join(', ')}</Col>
                      <Col md={2}>{doc.type}</Col>
                      <Col>{doc.connectionType}</Col>
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