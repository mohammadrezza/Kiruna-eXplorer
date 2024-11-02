import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Navbar } from 'react-bootstrap';
import '../style/header.css'

function Header({ className }) {
  return (
    <Navbar 
      className={`custom-navbar ${className || ''}`} 
      variant="light" 
      data-testid="header-wrapper">
      <hr></hr>
      <h3>Kiruna eXplorer</h3>
      <FaUserCircle className="profile-icon" />
    </Navbar>
  );
}

export default Header;
