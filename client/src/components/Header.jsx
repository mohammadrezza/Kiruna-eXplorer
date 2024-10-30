import { FaUserCircle } from 'react-icons/fa';
import { Navbar } from 'react-bootstrap';
import '../style/header.css'

function Header() {
  return (
    <>
    <Navbar className="custom-navbar" variant="light">
      <hr></hr>
      <h3>Kiruna eXplorer</h3>
      <FaUserCircle className="profile-icon" />
    </Navbar>
   </>
  );
}

export default Header;
