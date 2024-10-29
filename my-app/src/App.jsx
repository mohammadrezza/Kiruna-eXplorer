import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import FormDocument from './components/FormDocument';
import { FaUserCircle } from 'react-icons/fa';
import { Navbar,Container } from 'react-bootstrap';
import './assets/style/AppCSS.css'

function App() {
  return (
    <>
    <Navbar className="custom-navbar" variant="light">
        <div className="navbar-title">Kiruna eXplorer</div>
        <FaUserCircle className="profile-icon" />
    </Navbar>
    <Routes>
      <Route path='/newdoc/:mode' element={
          <FormDocument/>
      } />
      
   </Routes>
   </>
  );
}

export default App;
