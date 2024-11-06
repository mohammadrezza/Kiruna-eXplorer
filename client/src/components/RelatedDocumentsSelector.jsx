// RelatedDocumentsSelector.js
import React, { useState } from 'react';
import { Button, ListGroup, Row, Col, Form } from 'react-bootstrap';
import dayjs from 'dayjs';

function RelatedDocumentsSelector({
  mode,
  edit,
  allDocuments,
  relatedDocuments,
  selectedDocuments,
  onDocumentSelect,
  onRelatedDocumentClick
}) {
  const [showDocumentList, setShowDocumentList] = useState(false);

  return (
    <div>
      {(mode === 'add' || edit) ? (
        !showDocumentList ? (
          <Button 
            className="selectrelated" 
            variant="dark" 
            onClick={() => setShowDocumentList(true)}
          >
            Select Related Documents
          </Button>
        ) : (
          <div className="document-list">
            <h5>Select Related Documents</h5>
            <ListGroup className='relateddocs'>
              {allDocuments.map((doc) => (
                <ListGroup.Item key={doc.id}>
                  <Form.Check 
                    type="checkbox"
                    label={
                      <Row>
                        <Col>{doc.title}</Col>
                        <Col>{doc.stakeholders}</Col>
                        <Col>{dayjs(doc.issuanceDate).format('DD/MM/YYYY')}</Col>
                      </Row>
                    }
                    checked={selectedDocuments.includes(doc.id)}
                    onChange={() => onDocumentSelect(doc.id)}
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button 
              className="saveselection" 
              variant="dark" 
              onClick={() => setShowDocumentList(false)}
            >
              Save Selection
            </Button>
          </div>
        )
      ) : (
        <div className="document-list">
          <h5>Related Documents</h5>
          <ListGroup className='relateddocs'>
            {relatedDocuments.map((relatedDoc) => (
              relatedDoc && (
                <ListGroup.Item 
                  key={relatedDoc.id}
                  action
                  onClick={() => onRelatedDocumentClick(relatedDoc.id)}
                >
                  <Row>
                    <Col>{relatedDoc.title}</Col>
                    <Col>{relatedDoc.stakeholders}</Col>
                    <Col>{dayjs(relatedDoc.issuanceDate).format('DD/MM/YYYY')}</Col>
                  </Row>
                </ListGroup.Item>
              )
            ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
}

export default RelatedDocumentsSelector;
