import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage.tsx';
import SelectedWorks from './pages/selectedworks/SelectedWorks.tsx';
import NavBar from './components/navbar/NavBar.tsx';
import Footer from './components/footer/footer.tsx';
import { Provider } from 'react-redux';
import { store } from './state/store.ts';

import Upload from './pages/upload/Upload.tsx';
import Editor from './pages/editor/Editor.tsx';


const root = ReactDOM.createRoot(document.getElementById('root')!);

const router = createBrowserRouter([
  {
    path: '/',
    element:
      <>
        <NavBar />
        <HomePage />
      </>
  },
  {
    path: '/selected-works',
    element: 
    <>
        <NavBar />
        <SelectedWorks />
      </>
  },
  {
    path: '/eepy',
    element: 
    <>
        <NavBar />
        <Upload />
      </>
  },
  {
    path: '/editor',
    element: 
    <>
        <NavBar />
        <Editor />
      </>
  }
]);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      
      <RouterProvider router={router}></RouterProvider>
    </Provider>
    
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
