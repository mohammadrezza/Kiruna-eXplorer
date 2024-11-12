import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FormDocument from './pages/CreateDocument';
import Homepage from './pages/Homepage';
import DocumentsList from './pages/DocumentsList'
import Login from './pages/Login'
import { useState, useEffect } from 'react';
import API from './services/API.mjs';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const headerClasses = [
    isHomePage && 'dark-header',
    isLoginPage && 'dark-header transparent-header'
  ].filter(Boolean).join(' ');

  const [id,setId] = useState('');
  /*
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate()
  
  useEffect(() => {
    const checkAuth = async () => {
        try {
            const u = await API.getUser()
            console.log(u)
            setUser(u);
            setLoggedIn(true);
            setIsLoaded(true)
            navigate("/")
        } catch {
            setLoggedIn(false);
            setUser(undefined);
            setIsLoaded(true)
        }
    };

    checkAuth();
}, []);


  const doLogin = async (username,password)=>{
    try{
        const user = await API.login(username,password)
        setLoggedIn(true)
        setLoginMessage({msg:  `Welcome, ${user.name}!`, type: 'success'})
        setUser(user)
        navigate('/')
    }catch(err){
      setLoginMessage({msg: err, type: 'danger'})
    }

  }

  const handleLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    // clean up everything
    setLoginMessage('');
    setUser(undefined)
    navigate('/');
  };
*/

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
