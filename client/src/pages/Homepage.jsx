import React, { useContext } from 'react';
import { AuthContext } from '@/layouts/AuthContext';
import UPHomepage from '@/components/Home/UPHomepage';
import Guest from '@/components/Home/Guest';
import '@/style/Homepage.css';

function Homepage() {
  const { user } = useContext(AuthContext);

  // Check if user is defined and role exists
  const isUrbanPlanner = user?.role === "Urban Planner";

  return !isUrbanPlanner ? (
    <Guest/>
  ) : (
    <UPHomepage />
  );
}

export default Homepage;

// import React, { useContext } from 'react';
// import '../style/Homepage.css';
// import { useNavigate } from 'react-router-dom';
// import Slideshow from '../components/Slideshow';
// import { Row } from 'react-bootstrap';
// import { PiFilePlus, PiMapTrifold} from 'react-icons/pi';
// import { IoLibraryOutline } from "react-icons/io5";
// import { AuthContext } from '../layouts/AuthContext';
// import UPHomepage from '../components/UPHomepage';

// function Homepage() {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   const navigateTo = (path) => navigate(path);

//   return (
//     <div className="Homepage">
//       <div className="welcome-section">
//         <h2>Welcome to</h2>
//         <h1>Kiruna</h1>
//         <p>Sweden</p>
//         <Slideshow></Slideshow>
//       </div>
//       <main className="main-content">
//         <div className="search-section">
//           <div className="search-section-title">
//             <hr></hr>
//             <h2>My Tools & Features</h2>
//           </div>
//           <Row>
//             <button onClick={() => navigateTo('/documents')}> 
//               <IoLibraryOutline></IoLibraryOutline>
//               <span>List of Documents</span>
//             </button>
//             {user && 
//               <button onClick={() => navigateTo('/document/add')}> 
//                 <PiFilePlus></PiFilePlus>
//                 <span>Create a document</span>
//               </button>
//             }
//             <button onClick={() => navigateTo('/documents/map')}>
//               <PiMapTrifold></PiMapTrifold>
//               <span>Explore the map</span>
//             </button>
//           </Row>
//         </div>
//       </main>
//     </div>
//   ) 
// }

// export default Homepage;

