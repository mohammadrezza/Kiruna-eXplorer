// RelatedDocumentsSelector.js
import React, { useState } from 'react';
import { ListGroup, Row, Col, Form } from 'react-bootstrap';
import dayjs from 'dayjs';

function RelatedDocumentsSelector({
  mode,
  edit,
  allDocuments,
  selectedDocuments,
  onDocumentSelect,
  onRelatedDocumentClick
}) {

  return (
    <div className="document-list">
      <ListGroup className='relatedDocs'>
        <ListGroup.Item className='relatedDocs-header'>
          <Row>
            <Col md={1}></Col>
            <Col md={4}>Title</Col>
            <Col md={4}>Stakeholders</Col>
            <Col md={3}>Issuance Date</Col>
          </Row>
        </ListGroup.Item>
        {allDocuments.map((doc, num) => (
          <ListGroup.Item 
            key={doc.id} 
            className={selectedDocuments.includes(doc.id) ? 'selected' : ''}
            onClick={() => {(mode === 'add' || edit) ? onDocumentSelect(doc.id) : onRelatedDocumentClick(doc.id)}} 
            >
            <Row className="align-items-center">
              <Col md={1} className="text-center">
                {(mode === 'add' || edit) ? 
                <Form.Check 
                  type="checkbox"
                  id={`checkbox-${doc.id}`} 
                  checked={selectedDocuments.includes(doc.id)}
                  onChange={(e) => {
                    e.stopPropagation(); 
                  }}
                />
              : num + 1}
              </Col>
              <Col md={4}>{doc.title}</Col>
              <Col md={4}>{doc.stakeholders}</Col>
              <Col md={3}>{dayjs(doc.issuanceDate).format('DD/MM/YYYY')}</Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default RelatedDocumentsSelector;
