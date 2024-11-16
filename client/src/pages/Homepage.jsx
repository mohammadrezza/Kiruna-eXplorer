import React, { useState, useEffect } from 'react';
import '../style/Homepage.css';
import { useNavigate } from 'react-router-dom';
import Slideshow from '../components/Slideshow';
import { Row ,Col } from 'react-bootstrap';
import { PiFilePlus, PiFiles, PiMapTrifold} from 'react-icons/pi';


function Homepage(props) {
  const navigate = useNavigate();

  const handleNewDocument = () => {
    navigate(`/documents/add`);
  };
  

  const handleListDocument = () => {
    navigate('/documents')
  }

  return (
    <div className="Homepage">
      <div className="welcome-section">
        <h2>Welcome to</h2>
        <h1>Kiruna</h1>
        <p>Sweden</p>
        <Slideshow></Slideshow>
      </div>
      <main className="main-content">
        <div className="search-section">
          {props.logged && <button onClick={handleNewDocument}> 
            Create new document
          </button>}
          <Row>
            <Col>
              <button onClick={handleListDocument}> 
                <h2><PiFiles></PiFiles></h2>
                List of Documents 
              </button>
            </Col>
            <Col>
              <button onClick={handleNewDocument}> 
                <h2><PiFilePlus></PiFilePlus></h2>
                 Create a document 
                 </button>
            </Col>
            <Col>
              <button> <h2><PiMapTrifold></PiMapTrifold></h2> Explore the map </button>
            </Col>
          </Row>
        </div>
      </main>
    </div>
  );
}

export default Homepage;