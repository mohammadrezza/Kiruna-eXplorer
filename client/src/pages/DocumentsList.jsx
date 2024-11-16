import React, { useState,useEffect } from 'react';
import {Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PiMapPinSimpleAreaFill } from "react-icons/pi";
import DocumentMap from '../components/DocumentsMap';
import API from '../services/API.mjs';
import List from '../components/List';
import '../style/DocumentsList.css';

function DocumentsList(props) {

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
  const toggleMap = () => {
    setShowMap(prev => !prev);
  };

  return (
    <div className="wrapper">
      <div className="form-container">
      <h2 className='form-container-title'>
          Document List
          {props.logged && 
          <Button  className='add-button' onClick={()=>navigate('add')}>+ New document</Button>
          }
      </h2>
      <p className='form-container-subtitle'>
        <div className="map-view-trigger" onClick={toggleMap}>
          <PiMapPinSimpleAreaFill />
          <span>Show On Map</span>
        </div>
      </p>
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
