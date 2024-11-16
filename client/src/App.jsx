import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FormDocument from './pages/CreateDocument';
import Homepage from './pages/Homepage';
import DocumentsList from './pages/DocumentsList'
import Login from './pages/Login'
import { useState, useEffect } from 'react';
import API from './services/API.mjs';
import { Navigate } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const headerClasses = [
    isHomePage && 'dark-header',
    isLoginPage && 'dark-header transparent-header'
  ].filter(Boolean).join(' ');

  const [id,setId] = useState('');
  
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const navigate = useNavigate()
  
  useEffect(() => {
    const checkAuth = async () => {
        try {
            const u = await API.getUser()
            //console.log(u)
            setUser(u);
            setLoggedIn(true);
            navigate("/")
        } catch {
            setLoggedIn(false);
            setUser(undefined);
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
  /*
  const handleLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    // clean up everything
    setLoginMessage('');
    setUser(undefined)
    navigate('/');
  };
  */
  

  return (
    <>
    <Header className={headerClasses} logged={loggedIn}></Header>
    <Routes>
      <Route path='/' element={
          <Homepage logged={loggedIn}/>
      } />
      <Route path='/login' element={
          <Login login={doLogin} message={loginMessage} setMessage={setLoginMessage}/>
      } />
      <Route path='/documents/add' element={loggedIn ? <FormDocument mode={'add'}/> : <Navigate to={'/login'}/> } />
      <Route path='/documents/view/:id' element={ loggedIn ? <FormDocument mode={'view'} role={user.role}/> : <FormDocument mode={'view'}/>} />
      <Route path='/documents' element={
          <DocumentsList logged={loggedIn}/>
      } />
   </Routes>
   {isHomePage && <Footer />}
   </>
  );
}

export default App;
