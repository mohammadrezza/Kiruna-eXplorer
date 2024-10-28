import { FaUserCircle } from 'react-icons/fa';
import { Navbar } from 'react-bootstrap';
import '../style/Header.css'

function Header() {
  return (
    <>
    <Navbar className="custom-navbar" variant="light">
        <div className="navbar-title">Kiruna eXplorer</div>
        <FaUserCircle className="profile-icon" />
    </Navbar>
   </>
  );
}

export default Header;
