import React, {useEffect, useState} from 'react';
import {Row, Col,ListGroup } from 'react-bootstrap';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PiFileMagnifyingGlassLight } from 'react-icons/pi';
import DocumentDetailsModal from '../components/DocumentDetailsModal';
import API from '../services/API.mjs';
import '../style/DocumentsList.css';

function List(){
  const navigate = useNavigate();
  const { list, loading, sortConfig,handleSort,getSortIndicator } = useOutletContext();
  const [currentDocument, setCurrentDocument] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  

 
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

    const showDate = (issuanceDate) =>{
      const [dd, mm, yyyy] = issuanceDate.split("-");
      let realDate = '';
      realDate = realDate.concat((dd!=='00'?`${dd}-`:''),(mm!=='00'?`${mm}-`:''),yyyy)
      return realDate;
    }

    
    return(
    <div className="document-list">
        <ListGroup className='document-list-item'>
          <ListGroup.Item className='document-list-item-header'>
            <Row>
              <Col
                md={2}
                onClick={() => handleSort("title")}
                className={`sortable-column ${sortConfig.key === "title" ? "active" : ""}`}
                onMouseEnter={() => setHoveredColumn("title")} // Nuovo stato per hover
                onMouseLeave={() => setHoveredColumn(null)} // Reset dell'hover
              >
              Title{getSortIndicator("title")}
              </Col>
              <Col md={3}>Stakeholders</Col>
              <Col md={2} onClick={() => handleSort("type")}
              className={`sortable-column ${sortConfig.key === "type" ? "active" : ""}`}
              onMouseEnter={() => setHoveredColumn("type")} // Nuovo stato per hover
              onMouseLeave={() => setHoveredColumn(null)} // Reset dell'hover
              >
              Type{getSortIndicator("type")}</Col>
              <Col md={2} >Connections</Col>
              <Col onClick={() => handleSort("issuanceDate")}
              onMouseEnter={() => setHoveredColumn("issuanceDate")} // Nuovo stato per hover
              onMouseLeave={() => setHoveredColumn(null)} // Reset dell'hover
              className={`sortable-column ${sortConfig.key === "issuanceDate" ? "active" : ""}`}>
              Issuance Date{getSortIndicator("issuanceDate")}</Col>
            </Row>
          </ListGroup.Item>
          {!loading && Array.isArray(list) && list.map((doc, num) => (
            <ListGroup.Item 
              key={doc.id}  
              >
              <Row className="align-items-center">
                <Col md={2} className='doc-title' onClick={() => handleDocumentClick(doc.id)}>{doc.title}</Col>
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
                <Col md={2}>{doc.connections}</Col>
                <Col>{showDate(doc.issuanceDate)}</Col>
                <Col>
                  <span className='filesymbol' role="button" onClick={(e) => {
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
          <ListGroup.Item className="document-list-empty" hidden={!loading && list.length > 0}>
            <Row>
              <Col className="text-center" md={12}>
                {loading ? "Loading documents..." : "No documents available."}
              </Col>
            </Row>
          </ListGroup.Item>

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