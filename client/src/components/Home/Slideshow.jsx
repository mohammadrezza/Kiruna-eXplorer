import React, { useState, useEffect } from 'react';
import '@/style/Slideshow.css';

function Slideshow() {

  const images = ['/kiruna.png', '/kiruna2.png', '/kiruna3.png', '/kiruna4.png']; // Add paths to more images here
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 

    return () => clearInterval(interval); 
  }, [images.length]);


  return (
        <div className="image-container">
          <img
            src={images[currentImageIndex]}
            alt="Kiruna Slideshow"
            className="slideshow-image fade-in-out" 
          />
        </div>
  );
}

export default Slideshow;