import React, {useEffect, useState} from 'react';
import {Row, Col,ListGroup } from 'react-bootstrap';
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
  const [sortedList,setSortedList] = useState(list)

  const [sortConfig, setSortConfig] = useState({ key: '', direction: "" });

  useEffect(()=>{
    const loadDoc = async () => {
      try {
        const documents = await API.getSortedDocuments(sortConfig.key,sortConfig.direction);
        setSortedList(documents);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadDoc();
  }, [sortConfig]);

  useEffect(()=>{
    setSortedList(list);
  }, [list])

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

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
              <Col md={2}onClick={() => handleSort("title")}
              className={`sortable-column ${sortConfig.key === "title" ? "active" : ""}`}>Title  {getSortIndicator("title")}</Col>
              <Col md={3}>Stakeholders</Col>
              <Col md={2} onClick={() => handleSort("type")}
              className={`sortable-column ${sortConfig.key === "type" ? "active" : ""}`}>Type {getSortIndicator("type")}</Col>
              <Col md={2} >Connections</Col>
              <Col onClick={() => handleSort("issuanceDate")}
              className={`sortable-column ${sortConfig.key === "issuanceDate" ? "active" : ""}`}>Issuance Date {getSortIndicator("issuanceDate")}</Col>
            </Row>
          </ListGroup.Item>
          {!loading && sortedList.map((doc, num) => (
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
                <Col>{doc.issuanceDate}</Col>
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