import React, { useState, useEffect } from 'react';
import { ListGroup, Row, Col, Form } from 'react-bootstrap';
import { PiFileMagnifyingGlassLight } from 'react-icons/pi';
import DocumentDetailsModal from '@/components/DocumentDetailsModal';
import API from '@/services/API.mjs';
import '@/style/RelatedDocumentSelector.css';

function RelatedDocumentsSelector({
  mode,
  edit,
  allDocuments,
  relatedDocuments,
  selectedDocuments,
  selectedConnectionTypes, // Assicurati che selectedConnectionTypes venga passato come prop
  onDocumentSelect,
  onRelatedDocumentClick,
  onConnectionTypeChange,
  setSelectedConnectionTypes // Funzione per aggiornare selectedConnectionTypes
}) {
  const [connectionTypes, setConnectionTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);

  useEffect(() => {
    
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

  useEffect(() => {
    // Inizializza selectedConnectionTypes con i dati di relatedDocuments
    const initialConnectionTypes = relatedDocuments.map(doc => ({
      id: doc.id,
      type: doc.connectionType || connectionTypes[0] // Utilizza il primo tipo di connessione come fallback
    }));
    setSelectedConnectionTypes(initialConnectionTypes);
    console.log(initialConnectionTypes)
    console.log(selectedConnectionTypes)
    console.log(relatedDocuments)
  }
  , [relatedDocuments, connectionTypes, setSelectedConnectionTypes]);

  // When selectedDocuments change, trigger onConnectionTypeChange for any new selected document
  useEffect(() => {
    selectedDocuments.forEach((docId) => {
      const relatedDoc = relatedDocuments.find((doc) => doc.id === docId);
      onConnectionTypeChange(docId, relatedDoc?.connectionType || connectionTypes[0]);
    });
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

  const handleCheckboxChange = (docId, checked) => {
    if (checked) {
      if (connectionTypes.length > 0) {
        onConnectionTypeChange(docId, connectionTypes[0]);
        console.log(selectedConnectionTypes);
      }
    } else {
      setSelectedConnectionTypes(prev => prev.filter(item => item.id !== docId));
      console.log(selectedConnectionTypes);

    }
  };

  const handleRowClick = (docId) => {
    const isSelected = selectedDocuments.includes(docId);
    // Toggle checkbox selection when row is clicked
    if (isSelected) {
      setSelectedConnectionTypes(prev => prev.filter(item => item.id !== docId));
      onDocumentSelect(docId);
    } else {
      setSelectedConnectionTypes(prev => [
        ...prev,
        { id: docId, type: connectionTypes[0] }
      ]);
      onDocumentSelect(docId);
    }
  };
  
  return (
    <div className="document-list">
      <ListGroup className="relatedDocs">
        <ListGroup.Item className="relatedDocs-header">
          <Row>
            <Col md={1}></Col>
            <Col md={3}>Title</Col>
            <Col md={2}>Stakeholders</Col>
            <Col md={2}>Type</Col>
            <Col md={1}>Connected</Col>
            <Col md={2}>Connection type</Col>
          </Row>
        </ListGroup.Item>
        {allDocuments.map((doc, num) => (
          <ListGroup.Item
            key={doc.id}
            className={selectedDocuments.includes(doc.id) ? 'selected' : ''}
            onClick={() => {
              if (mode === 'add' || edit) {
                // This will handle the selection of the document
                handleRowClick(doc.id);
              } else {
                onRelatedDocumentClick(doc.id);
              }
            }}
          >
            <Row className="align-items-center">
              <Col md={1} className="text-center">
                {(mode === 'add' || edit) ? (
                  <Form.Check
                    type="checkbox"
                    id={`checkbox-${doc.id}`}
                    checked={selectedDocuments.includes(doc.id)}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleCheckboxChange(doc.id, e.target.checked);
                    }}
                  />
                ) : num + 1}
              </Col>
              <Col md={3}>{doc.title}</Col>
              <Col md={2}>{doc.stakeholders.join(', ')}</Col>
              <Col md={2}>{doc.type}</Col>
              <Col md={1} className="text-center">{doc.connections}</Col>
              <Col md={2}>
                {(mode === 'add' || edit) && selectedDocuments.includes(doc.id) ? (
                  <Form.Select
                    className="connectionform"
                    aria-label="Select connection type"
                    defaultValue={
                      selectedConnectionTypes.find((relatedDoc) => relatedDoc.id === doc.id)?.type ||
                      connectionTypes[0] ||
                      ''
                    }
                    onChange={(e) => onConnectionTypeChange(doc.id, e.target.value)} // Notify parent on change
                  >
                    <option value="" disabled>
                      Select connection
                    </option>
                    {connectionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Select>
                ) : mode === 'view' ? (
                  doc.connectionType
                ) : null}
              </Col>
              <Col>
                <span className="filesymbol">
                  <PiFileMagnifyingGlassLight
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleIconClick(doc);
                    }}
                  />
                </span>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <DocumentDetailsModal show={showModal} onHide={handleCloseModal} document={currentDocument} />
    </div>
  );
}

export default RelatedDocumentsSelector;