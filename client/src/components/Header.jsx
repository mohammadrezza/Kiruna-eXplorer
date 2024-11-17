import React, { useContext } from 'react';
import {useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { Navbar } from 'react-bootstrap';
import { AuthContext } from '../layouts/AuthContext';
import '../style/Header.css'

function Header({ className }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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
      {(!isLoginPage && !user) && <FaUserCircle className="profile-icon" data-testid="profile-icon" onClick={handleLoginClick}/>}
    </Navbar>
  );
}

export default Header;
