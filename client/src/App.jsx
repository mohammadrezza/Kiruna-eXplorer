import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateDocument from './pages/CreateDocument';
import Homepage from './pages/Homepage';
import DocumentsList from './pages/DocumentsList'
import { useState } from 'react';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const [id,setId] = useState('')


  const handleIdNavigate = (docID) =>{
    setId(docID);
  }
  

  return (
    <>
    <Header className={isHomePage ? 'dark-header' : ''}></Header>
    <Routes>
      <Route path='/' element={
          <Homepage/>
      } />
      <Route path='/documents/:mode' element={
          <CreateDocument/>
      } />
      <Route path='/documents/:mode/:id' element={
          <CreateDocument/>
      } />
      <Route path='/documents' element={
          <DocumentsList/>
      } />
   </Routes>
   {isHomePage && <Footer />}
   </>
  );
}

export default App;
