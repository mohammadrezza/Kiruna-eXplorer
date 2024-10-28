import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import App from './App';
import './style/index.css';

const router = createBrowserRouter([{
  path:'/*',
  element:<App/>
}])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <RouterProvider router={router}/>
  </>
);
