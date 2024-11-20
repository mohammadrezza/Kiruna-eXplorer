import React from 'react';
import { useState, useEffect } from 'react';
import { ListGroup, Row, Col, Form } from 'react-bootstrap';
import API from '../services/API.mjs';
import '../style/RelatedDocumentSelector.css'
import { PiFileMagnifyingGlassLight } from 'react-icons/pi';
import DocumentDetailsModal from './DocumentDetailsModal';

function RelatedDocumentsSelector({
  mode,
  edit,
  allDocuments,
  relatedDocuments,
  selectedDocuments,
  onDocumentSelect,
  onRelatedDocumentClick,
  onConnectionTypeChange
}) {
  const [connectionTypes, setConnectionTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);

  useEffect(() => {
    console.log(allDocuments);
    console.log(selectedDocuments);
    console.log(relatedDocuments);
    const fetchConnectionTypes = async () => {
      try {
        const response = await API.getConnectionTypes(); 
        setConnectionTypes(response);
        
      } catch (error) {
        console.error('Error fetching connection types:', error);
      }
    };
    
    fetchConnectionTypes();
  }, []);

  const handleIconClick = async (doc) => {
    try {
      const docData = await API.getData(doc.id); 
      setCurrentDocument(docData);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching document data:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDocument(null);
  };

  return (
    <div className="document-list">
      <ListGroup className='relatedDocs'>
        <ListGroup.Item className='relatedDocs-header'>
          <Row>
            <Col md={1}></Col>
            <Col md={3}>Title</Col>
            <Col md={2}>Stakeholders</Col>
            {/* <Col md={2}>Issuance Date</Col> */}
            <Col md={2}>Type</Col>
            <Col md={1}>Connected</Col>
            <Col md={2}>Connection type</Col>
          </Row>
        </ListGroup.Item>
        {allDocuments.map((doc, num) => (
          <ListGroup.Item 
            key={doc.id} 
            className={selectedDocuments.includes(doc.id) ? 'selected' : ''}
            // onClick={() => {(mode === 'add' || edit) ? (onDocumentSelect(doc.id)) : onRelatedDocumentClick(doc.id)}} 
            onClick={() => {
              if(mode==='add'||edit){
                onDocumentSelect(doc.id);
                onConnectionTypeChange(doc.id, connectionTypes[0]);
              }
              else{
                onRelatedDocumentClick(doc.id)
              }
            }} 
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
              <Col md={3}>{doc.title}</Col>
              <Col md={2}>{doc.stakeholders.join(', ')}</Col>
              {/* <Col md={2}>{dayjs(doc.issuanceDate).format('DD/MM/YYYY')}</Col> */}
              <Col md={2}>{doc.type}</Col>
              <Col md={1} className="text-center">{doc.connections}</Col>
              <Col md={2}>
              {(mode === 'add' || edit) && selectedDocuments.includes(doc.id)?( 
                <Form.Select
                  className='connectionform'
                  aria-label="Select connection type"
                  defaultValue={
                    relatedDocuments.find(relatedDoc => relatedDoc.id === doc.id)?.connectionType ||connectionTypes[0]|| "" 
                  }
                  onChange={(e) => onConnectionTypeChange(doc.id, e.target.value)} // Notify parent on change
                  onClick={() => {
                    // Assegna il primo tipo di connessione al documento se non ha già una connessione
                    if (!relatedDocuments.find((relatedDoc) => relatedDoc.id === doc.id)?.connectionType) {
                      onConnectionTypeChange(doc.id, connectionTypes[0]);
                    }
                  }}
                >
                  <option value="" disabled>Select connection</option>
                  {connectionTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Select>)
              : mode==='view'? doc.connectionType : null}
              </Col>
              <Col>
              <span className='filesymbol'>
                <PiFileMagnifyingGlassLight
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click event
                    handleIconClick(doc);
                  }}>
                </PiFileMagnifyingGlassLight>
              </span>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <DocumentDetailsModal
        show={showModal}
        onHide={handleCloseModal}
        document={currentDocument}
      />
    </div>
  );
}

export default RelatedDocumentsSelector;
