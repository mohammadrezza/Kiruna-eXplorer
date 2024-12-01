import React from 'react';
import { Routes, Route, useLocation} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Footer from './components/Footer';
import FormDocument from './pages/CreateDocument';
import Homepage from './pages/Homepage';
import DocumentsLayout from './layouts/DocumentsLayout'
import DocumentsList from './components/List'
import DocumentMap from './components/DocumentsMap'
import Login from './pages/Login'
import { AuthProvider } from "./layouts/AuthContext";
import PrivateRoute from './layouts/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const headerClasses = [
    isHomePage && 'dark-header',
    isLoginPage && 'dark-header transparent-header'
  ].filter(Boolean).join(' ');

  return (
    <>
    <AuthProvider>
    <Header className={headerClasses}></Header>
    <ScrollToTop />
    <Routes>
      <Route path='/' element={<Homepage />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/document/add' element={
        <PrivateRoute><FormDocument mode={'add'}/></PrivateRoute>
      } />
      <Route path='/document/view/:id' element={
        <FormDocument mode={'view'}/>
      } />
      <Route path='/documents' element={<DocumentsLayout/>}>
        <Route index element={<DocumentsList mode="list"/>} />
        <Route path="map" element={<DocumentMap  mode="map"/>} /> 
      </Route>
   </Routes>
   {isHomePage && <Footer />}
   <ToastContainer 
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
   </AuthProvider>
   </>
  );
}

export default App;
