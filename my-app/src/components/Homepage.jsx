import React from 'react';
import '../assets/style/HomepageCSS.css';

function Homepage() {
  return (
    <div className="Homepage">
      <header className="header">
        <div className="welcome-section">
          <h2>Welcome to</h2>
          <h1>Kiruna</h1>
          <p>Sweden</p>
        </div>
        <div className="logo">
          <h1>Kiruna eXplorer</h1>
        </div>
      </header>
      
      <main className="main-content">
        <div className="image-container">
          <img src="Kiruna-eXplorer/my-app/public/kiruna.png" alt="Kiruna Design" />
        </div>
        <div className="search-section">
          <h2>Search for Documents</h2>
          <div className="search-bar">
            <input type="text" placeholder="Type document name" />
            <button>
              <span>&#9654;</span> {/* This is a triangle symbol for the search button */}
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Kiruna Explorer</p>
        <p>Done by GROUP 11</p>
      </footer>
    </div>
  );
}

export default Homepage;