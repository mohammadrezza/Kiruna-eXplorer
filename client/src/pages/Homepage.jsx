import React, { useState, useEffect } from 'react';
import '../style/Homepage.css';
import { useNavigate } from 'react-router-dom';
import Slideshow from '../components/Slideshow';

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
        </div>
      </main>
    </div>
  );
}

export default Homepage;