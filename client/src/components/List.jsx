import React, {useState} from 'react';
import {Row, Col,ListGroup } from 'react-bootstrap';
import * as dayjs from 'dayjs'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PiFileMagnifyingGlassLight } from 'react-icons/pi';
import DocumentDetailsModal from '../components/DocumentDetailsModal';
import API from '../services/API.mjs';
import '../style/DocumentsList.css';

function List(){
    const navigate = useNavigate();
    const { list, loading } = useOutletContext();
    const [currentDocument, setCurrentDocument] = useState('');
    const [showModal, setShowModal] = useState(false);

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
    const handleDocumentClick = (documentId) => navigate(`/document/view/${documentId}`);


    return(
    <div className="document-list">
        <ListGroup className='document-list-item'>
          <ListGroup.Item className='document-list-item-header'>
            <Row>
              <Col md={3}>Title</Col>
              <Col md={3}>Stakeholders</Col>
              <Col md={2}>Type</Col>
              <Col md={1}>Connections</Col>
              <Col>Issuance Date</Col>
            </Row>
          </ListGroup.Item>
          {!loading && list.map((doc, num) => (
            <ListGroup.Item 
              key={doc.id}  
              >
              <Row className="align-items-center">
                <Col md={3} className='doc-title' onClick={() => handleDocumentClick(doc.id)}>{doc.title}</Col>
                <Col md={3} className='stakeholder-col'> 
                {doc.stakeholders
                  .slice() 
                  .sort((a, b) => a.localeCompare(b))
                  .map((s, index) => (
                    <div
                      key={index}
                      className={`stakeholder-badge stakeholder-${s.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {s}
                    </div>
                  ))}
                </Col>
                <Col md={2}>{doc.type}</Col>
                <Col md={1}>{doc.connections}</Col>
                <Col>{dayjs(doc.issuanceDate).format('DD/MM/YYYY')}</Col>
                <Col>
                  <span className='filesymbol' onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleIconClick(doc);
                    }}>
                      Preview
                      <PiFileMagnifyingGlassLight size={22}></PiFileMagnifyingGlassLight>
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
    )
}

export default List