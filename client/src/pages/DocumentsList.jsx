import '../style/DocumentsList.css';
import React, { useState,useEffect } from 'react';
import {Button, Row, Col,ListGroup } from 'react-bootstrap';
import API from '../services/API.mjs';
import * as dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';
import { PiFileText } from 'react-icons/pi';
import DocumentDetailsModal from '../components/DocumentDetailsModal';

function DocumentsList() {

  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading,setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState('');

  useEffect(()=>{
    const loadData = async () => {
      try {
        const documents = await API.getDocuments();
        console.log(documents)
        setList(documents);
        
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  const handleDocumentClick = (documentId) => navigate(`view/${documentId}`);

  return (
    <div className="wrapper">
      <div className="form-container">
      <h2 className='form-container-title'>
          Document List
          <Button  className='add-button' onClick={()=>navigate('add')}>+Add new document</Button>
      </h2>
        <div className="document-list">
          <ListGroup className='relatedDocs'>
            <ListGroup.Item className='relatedDocs-header'>
              <Row>
                <Col md={3}>Title</Col>
                <Col md={3}>Stakeholders</Col>
                <Col md={2}>Type</Col>
                <Col md={2}>Issuance Date</Col>
                <Col md={1}>Connections</Col>
              </Row>
            </ListGroup.Item>
            {!loading && list.map((doc, num) => (
              <ListGroup.Item 
                key={doc.id} 
                onClick={() => handleDocumentClick(doc.id)} 
                >
                <Row className="align-items-center">
                  <Col md={3} className='doc-title'>{doc.title}</Col>
                  <Col md={3}>{doc.stakeholders}</Col>
                  <Col md={2}>{doc.type}</Col>
                  <Col md={2}>{dayjs(doc.issuanceDate).format('DD/MM/YYYY')}</Col>
                  <Col md={1}>{doc.connections}</Col>
                  <Col>
                    <PiFileText 
                      className='filesymbol' 
                      size={22} 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event
                        handleIconClick(doc);
                      }}>
                    </PiFileText>
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
      </div>
    </div>
  );
}

export default DocumentsList;
