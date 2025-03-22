// import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import reportWebVitals from './reportWebVitals';
// import { createBrowserRouter, RouterProvider, BrowserRouter, Router, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/homepage/HomePage.tsx';
// import SelectedWorks from './pages/selectedworks/SelectedWorks.tsx';
// import NavBar from './components/navbar/NavBar.tsx';
// import Footer from './components/footer/footer.tsx';
// import { Provider } from 'react-redux';
// import { store } from './state/store.ts';
// import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
// import Upload from './pages/upload/Upload.tsx';
// import Editor from './pages/editor/Editor.tsx';
// import ProjectPage from './pages/project/project.tsx';
// import ProjectEditor from './pages/project-editor/project-editor.tsx';
// import { getProjectUrls } from './firebase/firebase.tsx';
// import Project from './pages/project/project.tsx';


// const root = ReactDOM.createRoot(document.getElementById('root')!);
// interface projectIdWithUrl {
//   url: string;
//   id: string;
// };
// const [projectIds, setProjectIds] = useState<projectIdWithUrl[]>([]);

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element:
//       <>
//         <NavBar />
//         <HomePage />
//       </>
//   },
//   {
//     path: '/selected-works',
//     element: 
//     <>
//         <NavBar />
//         <SelectedWorks />
//       </>
//   },
//   {
//     path: '/eepy',
//     element: 
//     <>
//         <NavBar />
//         <Upload />
//       </>
//   },
//   {
//     path: '/editor',
//     element: 
//     <>
//         <NavBar />
//         <Editor />
//       </>
//   }, 
//   {
//     path: '/project-editor',
//     element:
//       <>
//         <NavBar />
//         <ProjectEditor/>
//       </>
//   },
//   {
//     path: '/project',
//     element:
//       <>
//         <NavBar />
//         <ProjectPage projectId='defaultProjectId'/>
//       </>
//   },
//   ...projectIds.map((url) => ({
//       path: `/projects/${url.url}`,
//       element: 
//       <>
//         <NavBar />
//         <Project projectId={url.id} />
//       </>
//   }))
// ]);


// useEffect(() => {
//   const fetchProjects = async () =>{
//     setProjectIds(await getProjectUrls());
//   }
//   fetchProjects();
// }, []);

// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//         <RouterProvider router={router}></RouterProvider>
      
//     </Provider>
    
    
//   </React.StrictMode>
// );
// // const router = (
// //   <BrowserRouter basename={process.env.PUBLIC_URL}>
// //     <Routes>
// //       <Route path="/" element={<><NavBar /><HomePage /></>} />
// //       <Route path='/selected-works' element={<><NavBar /><SelectedWorks /></>} />
// //       <Route path="/eepy" element={<><NavBar /><Upload /></>} />
// //       <Route path="/editor" element={<><NavBar /><Editor /></>} />
// //     </Routes>
// //   </BrowserRouter>
// // );

// // const root = ReactDOM.createRoot(document.getElementById('root')!);
// // root.render(
// //   <React.StrictMode>
// //     <Provider store={store}>
// //       {router}
// //     </Provider>
// //   </React.StrictMode>
// // );


import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage.tsx';
import SelectedWorks from './pages/selectedworks/SelectedWorks.tsx';
import NavBar from './components/navbar/NavBar.tsx';
import Footer from './components/footer/footer.tsx';
import { Provider } from 'react-redux';
import { store } from './state/store.ts';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import Upload from './pages/upload/Upload.tsx';
import Editor from './pages/editor/Editor.tsx';
import ProjectPage from './pages/project/project.tsx';
import ProjectEditor from './pages/project-editor/project-editor.tsx';
import { getProjectUrls } from './firebase/firebase.tsx';
import Project from './pages/project/project.tsx';

const root = ReactDOM.createRoot(document.getElementById('root')!);

const App = () => {
  // State for project URLs
  const [projectIds, setProjectIds] = useState<{ url: string, id: string }[]>([]);

  // Fetch project URLs on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await getProjectUrls();
      setProjectIds(projects);
    };

    fetchProjects();
  }, []);

  // Create the router based on the project URLs
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <NavBar />
          <HomePage />
        </>
      ),
    },
    {
      path: '/selected-works',
      element: (
        <>
          <NavBar />
          <SelectedWorks />
        </>
      ),
    },
    {
      path: '/eepy',
      element: (
        <>
          <NavBar />
          <Upload />
        </>
      ),
    },
    {
      path: '/editor',
      element: (
        <>
          <NavBar />
          <Editor />
        </>
      ),
    },
    {
      path: '/project-editor',
      element: (
        <>
          <NavBar />
          <ProjectEditor />
        </>
      ),
    },
    {
      path: '/project',
      element: (
        <>
          <NavBar />
          <ProjectPage projectId="defaultProjectId" />
        </>
      ),
    },
    ...projectIds.map((project) => ({
      path: `/projects/${project.url}`,
      element: (
        <>
          <NavBar />
          <Project projectId={project.id} />
        </>
      ),
    })),
  ]);

  if (projectIds.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
