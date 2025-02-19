import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, BrowserRouter, Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage.tsx';
import SelectedWorks from './pages/selectedworks/SelectedWorks.tsx';
import NavBar from './components/navbar/NavBar.tsx';
import Footer from './components/footer/footer.tsx';
import { Provider } from 'react-redux';
import { store } from './state/store.ts';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import Upload from './pages/upload/Upload.tsx';
import Editor from './pages/editor/Editor.tsx';
import { Project } from './types/Project.ts';
import ProjectPage from './pages/project/project.tsx';
import ProjectEditor from './pages/project-editor/project-editor.tsx';


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
  }, 
  {
    path: '/project-editor',
    element:
      <>
        <NavBar />
        <ProjectEditor/>
      </>
  },
  {
    path: '/project',
    element:
      <>
        <NavBar />
        <ProjectPage projectId='defaultProjectId'/>
      </>
  }
]);

const client = new ApolloClient({
  uri: 'https://api.yelp.com/v3/graphql', // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <RouterProvider router={router}></RouterProvider>
      </ApolloProvider>
      
    </Provider>
    
    
  </React.StrictMode>
);
// const router = (
//   <BrowserRouter basename={process.env.PUBLIC_URL}>
//     <Routes>
//       <Route path="/" element={<><NavBar /><HomePage /></>} />
//       <Route path='/selected-works' element={<><NavBar /><SelectedWorks /></>} />
//       <Route path="/eepy" element={<><NavBar /><Upload /></>} />
//       <Route path="/editor" element={<><NavBar /><Editor /></>} />
//     </Routes>
//   </BrowserRouter>
// );

// const root = ReactDOM.createRoot(document.getElementById('root')!);
// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       {router}
//     </Provider>
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
