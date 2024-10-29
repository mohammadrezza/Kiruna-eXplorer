import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CreateDocument from './pages/CreateDocument';

function App() {
  return (
    <>
    <Header></Header>
    <Routes>
      <Route path='/documents/:mode' element={
          <CreateDocument/>
      } />
      
   </Routes>
   </>
  );
}

export default App;
