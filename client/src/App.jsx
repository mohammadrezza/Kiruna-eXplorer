import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FormDocument from './pages/CreateDocument';
import Homepage from './pages/Homepage';
import DocumentsList from './pages/DocumentsList'
import Login from './pages/Login'
import { useState } from 'react';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const headerClasses = [
    isHomePage && 'dark-header',
    isLoginPage && 'dark-header transparent-header'
  ].filter(Boolean).join(' ');

  const [id,setId] = useState('')


  const handleIdNavigate = (docID) =>{
    setId(docID);
  }
  

  return (
    <>
    <Header className={headerClasses}></Header>
    <Routes>
      <Route path='/' element={
          <Homepage/>
      } />
      <Route path='/login' element={
          <Login/>
      } />
      <Route path='/documents/add' element={
          <FormDocument mode={'add'}/>
      } />
      <Route path='/documents/view/:id' element={
          <FormDocument mode={'view'}/>
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
