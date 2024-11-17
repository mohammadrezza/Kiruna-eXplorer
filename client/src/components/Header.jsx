import React, { useContext } from 'react';
import {useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { Button, Navbar } from 'react-bootstrap';
import { AuthContext } from '../layouts/AuthContext';
import '../style/header.css'

function Header({ className }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const { logout } = useContext(AuthContext); // Access login function from AuthContext
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleLoginClick = () => {
    navigate('/login');
  };
  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogoutClick = async () => {
    try{
      await logout();
      window.location.reload(false);
    }catch(error){

      throw error;
    }
  }

  return (
    <Navbar 
      className={`custom-navbar ${className || ''}`} 
      variant="light" 
      data-testid="header-wrapper">
      <hr></hr>
      <h3 onClick={handleLogoClick}>Kiruna eXplorer</h3>
      {(!isLoginPage && !user) && <FaUserCircle className="profile-icon" data-testid="profile-icon" onClick={handleLoginClick}/>}
      {(!isLoginPage && user) && <Button className="logout-icon" onClick={handleLogoutClick}>Logout</Button>}
    </Navbar>
  );
}

export default Header;
