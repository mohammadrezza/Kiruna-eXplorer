import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slideshow from '@/components/Home/Slideshow';
import '@/style/Homepage.css';

function Homepage() {
  const navigate = useNavigate();

  const navigateTo = (path) => navigate(path);

  return(
    <div className="Homepage">
      <div className="welcome-section">
        <h2>Welcome to</h2>
        <h1>Kiruna</h1>
        <p>Sweden</p>
        <Slideshow></Slideshow>
      </div>
    </div>
)}

export default Homepage;
