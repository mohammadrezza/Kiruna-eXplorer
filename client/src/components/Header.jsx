import React from 'react';
import {useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { Navbar } from 'react-bootstrap';
import '../style/header.css'

function Header({ className, logged }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Navbar 
      className={`custom-navbar ${className || ''}`} 
      variant="light" 
      data-testid="header-wrapper">
      <hr></hr>
      <h3 onClick={handleLogoClick}>Kiruna eXplorer</h3>
      {(!isLoginPage && !logged) && <FaUserCircle className="profile-icon" data-testid="profile-icon" onClick={handleLoginClick}/>}
    </Navbar>
  );
}

export default Header;
