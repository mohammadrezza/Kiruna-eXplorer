import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import CreateDocument from './pages/FormDocument';
import { FaUserCircle } from 'react-icons/fa';
import { Navbar, Container } from 'react-bootstrap';
import './style/AppCSS.css'

function App() {
  return (
    <>
    <Navbar className="custom-navbar" variant="light">
        <div className="navbar-title">Kiruna eXplorer</div>
        <FaUserCircle className="profile-icon" />
    </Navbar>
    <Routes>
      <Route path='/documents/create' element={
          <CreateDocument/>
      } />
      
   </Routes>
   </>
  );
}

export default App;
