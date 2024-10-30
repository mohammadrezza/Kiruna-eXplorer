import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateDocument from './pages/CreateDocument';

function App() {
  const location = useLocation();
  return (
    <>
    <Header></Header>
    <Routes>
      <Route path='/documents/:mode' element={
          <CreateDocument/>
      } />
   </Routes>
   {location.pathname === '/' && <Footer />}
   </>
  );
}

export default App;
