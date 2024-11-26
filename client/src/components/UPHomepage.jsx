import React, { useContext, useState } from 'react';
import '../style/UPHomepage.css';
import { useNavigate } from 'react-router-dom';
import { Row, Form, Col, Button } from 'react-bootstrap';
import { PiFilePlus, PiMapTrifold } from 'react-icons/pi';
import { IoLibraryOutline } from "react-icons/io5";
import { AuthContext } from '../layouts/AuthContext';
import { VscSend } from "react-icons/vsc";

function UPHomepage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');

  const navigateTo = (path) => navigate(path);

  const handleSearch = () => {
    console.log('Search query:', searchQuery);
    // Implementa la logica di ricerca, se necessario
  };

  return (
    <div className="UPHomepage">
      <main className="main-content">
        <div className="search-section">
          <div className="search-section-title">
            <h2>My Tools</h2>
          </div>
          <Row className='buttons'>
            <button onClick={() => navigateTo('/documents')}>
              <IoLibraryOutline />
              <span>List of Documents</span>
            </button>
            {user &&
              <button onClick={() => navigateTo('/document/add')}>
                <PiFilePlus />
                <span>Create a document</span>
              </button>
            }
            <button onClick={() => navigateTo('/documents/map')}>
              <PiMapTrifold />
              <span>Explore the map</span>
            </button>
          </Row>
          <Row className="search-bar">
              <Form.Control className='search'
                type="text"
                placeholder="Enter the document name to search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            
              <button>
                <VscSend className='sendIcon' onClick={handleSearch}></VscSend>
              </button>
            
          </Row>
        </div>
      </main>
    </div>
  );
}

export default UPHomepage;