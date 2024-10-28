import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import AddDocument from './components/AddDocument';
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
      <Route path='/newdoc' element={
          <AddDocument/>
      } />
      
   </Routes>
   </>
  );
}

export default App;
