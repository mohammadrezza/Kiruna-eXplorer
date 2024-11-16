import { Routes, Route, useLocation, Navigate} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FormDocument from './pages/CreateDocument';
import Homepage from './pages/Homepage';
import DocumentsList from './pages/DocumentsList'
import Login from './pages/Login'
import { AuthProvider } from "./layouts/AuthContext";
import PrivateRoute from './layouts/PrivateRoute';

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
    <Routes>
      <Route path='/' element={<Homepage />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/documents/add' element={
        <PrivateRoute><FormDocument mode={'add'}/></PrivateRoute>
      } />
      <Route path='/documents/view/:id' element={
        <FormDocument mode={'view'}/>
      } />
      <Route path='/documents' element={<DocumentsList/>} />
   </Routes>
   {isHomePage && <Footer />}
   </AuthProvider>
   </>
  );
}

export default App;
