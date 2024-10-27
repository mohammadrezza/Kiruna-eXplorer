import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import AddDocument from './components/AddDocument';

function App() {
  return (
   <Routes>
      <Route path='/newdoc' element={
          <AddDocument/>
      } />
      
   </Routes>
  );
}

export default App;
