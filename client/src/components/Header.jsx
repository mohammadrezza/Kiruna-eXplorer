import React from 'react';
import {useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { Navbar } from 'react-bootstrap';
import '../style/header.css'

function Header({ className }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Navbar 
      className={`custom-navbar ${className || ''}`} 
      variant="light" 
      data-testid="header-wrapper">
      <hr></hr>
      <h3>Kiruna eXplorer</h3>
      {!isLoginPage && <FaUserCircle className="profile-icon" onClick={handleLoginClick}/>}
    </Navbar>
  );
}

export default Header;
