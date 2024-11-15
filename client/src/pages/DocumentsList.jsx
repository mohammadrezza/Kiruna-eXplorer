import '../style/DocumentsList.css';
import React, { useState,useEffect } from 'react';
import {Button, Row, Col,ListGroup } from 'react-bootstrap';
import API from '../services/API.mjs';
import * as dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';
import { PiFileMagnifyingGlassLight } from 'react-icons/pi';
import DocumentDetailsModal from '../components/DocumentDetailsModal';
import DocumentMap from '../components/DocumentsMap';
import List from '../components/List';

function DocumentsList() {

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [list, setList] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false)
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

  const handleDocumentClick = (documentId) => navigate(`view/${documentId}`);

  return (
    <div className="wrapper">
      <div className="form-container">
      <h2 className='form-container-title'>
          Document List
          <Button  className='add-button' onClick={()=>navigate('add')}>+Add new document</Button>
      </h2>
      {showMap ? (
        <DocumentMap documents={list} />
      ):(
        <List list={list} 
        handleDocumentClick={handleDocumentClick} 
        handleIconClick={handleIconClick}
        currentDocument={currentDocument}
        handleCurrentDocument={setCurrentDocument}
        showModal={showModal}
        handleShowModal={setShowModal}
        />
      )}
      </div>
    </div>
  );
}

export default DocumentsList;
