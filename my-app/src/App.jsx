import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import AddDocument from './components/AddDocument';
import Homepage from '../../client/src/pages/Homepage';

function App() {
  return (
   <Routes>
      <Route path='/' element={
          <Homepage/>
      } />
      <Route path='/newdoc' element={
          <AddDocument/>
      } />
      
   </Routes>
  );
}

export default App;
