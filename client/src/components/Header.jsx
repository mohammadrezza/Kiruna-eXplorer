import React, { useContext } from 'react';
import {useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { Navbar } from 'react-bootstrap';
import { IoLogOutSharp, IoLibraryOutline } from "react-icons/io5";
import { PiMapTrifold } from 'react-icons/pi';
import { AuthContext } from '@/layouts/AuthContext';
import '@/style/headerStyle.css'

function Header({ className }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isDocumentsListPage = location.pathname === '/document/add' || location.pathname.includes('document/view');
  const { logout } = useContext(AuthContext); // Access login function from AuthContext
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const navigateTo = (path) => navigate(path);

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
      className={`custom-navbar ${(user ? '' : (className || ''))}`} 
      variant="light" 
      data-testid="header-wrapper">
      {!isDocumentsListPage ? <hr /> : 
      <div>
        <IoLibraryOutline data-testid='lib' className="profile-icon" onClick={() => navigateTo('/documents')}/>
        <PiMapTrifold data-testid='map' className="profile-icon" onClick={() => navigateTo('/documents/map')}/>
      </div>}
      <h3 onClick={() => navigateTo('/')} role="button">Kiruna eXplorer</h3>
      <div className='custom-navbar-actions'>
      {user ? (
          <div className="user-info">
            <div className="user-details">
              <span className="username">{user.username || 'Utente'}</span>
              <span className="role">{user.role || 'Ruolo non specificato'}</span>
            </div>
            <FaUserCircle className="user-avatar" />
            <IoLogOutSharp
              data-testid='logout'
              className="logout-icon"
              onClick={handleLogoutClick}
              title="Logout"
            />
          </div>
        ) : (
          !isLoginPage && (
            <FaUserCircle
              className="profile-icon"
              data-testid="profile-icon"
              onClick={() => navigateTo('/login')}
            />
          )
        )}
      </div>
      
    </Navbar>
  );
}

export default Header;
