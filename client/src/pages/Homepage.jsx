import React, { useState, useEffect } from 'react';
import '../style/Homepage.css';
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const navigate = useNavigate();

  const images = ['/kiruna.png', '/kiruna2.jpeg', '/kiruna3.jpeg', '/kiruna4.webp']; // Add paths to more images here
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 

    return () => clearInterval(interval); 
  }, [images.length]);

  const handleNewDocument = () => {
    navigate(`/documents/add`);
  };

  return (
    <div className="Homepage">
      <div className="welcome-section">
        <h2>Welcome to</h2>
        <h1>Kiruna</h1>
        <p>Sweden</p>
        <div className="image-container">
          <img
            src={images[currentImageIndex]}
            alt="Kiruna Slideshow"
            className="slideshow-image fade-in-out" 
          />
        </div>
      </div>
      <main className="main-content">
        <div className="search-section">
          <button onClick={handleNewDocument}> 
            Create new document
          </button>
        </div>
      </main>
    </div>
  );
}

export default Homepage;