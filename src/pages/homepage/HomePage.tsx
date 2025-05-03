import { Box, Grid2 as Grid } from '@mui/material';
import * as React from 'react';
import "./HomePage.css"
import MediumWideImage from '../../components/hometiles/medium/medium-wide-image.tsx';
import UltraWideImage from '../../components/hometiles/wide/ultra-wide-image.tsx';
import SquareImage from '../../components/hometiles/square/square-image.tsx';
import Footer from '../../components/footer/footer.tsx';
import { useEffect, useState } from 'react';
import MobileTile from '../../components/hometiles/mobile/mobile-tile.tsx';
import { firestore, getProject, getProjectListInOrder, getProjectOrder, storage } from "../../firebase/firebase.tsx";
import { collection, getDocs } from 'firebase/firestore';
import { HomeTileType } from '../../enums/HomeTileType.ts';
import { HomeTileForm } from '../../types/HomeTileForm.ts';
import UserList from '../../components/test/test.js';
import { Project } from '../../types/Project.ts';
import HomeTile from '../../components/hometiles/hometile.tsx';

function HomePage() {

    const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 1000px)').matches);

    const [projectObjects, setProjectObjects] = useState<Project[]>([]);

    const [rerender, setRerender] = useState<number>(0);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1000px)');
        const handleMediaChange = (e) => {
            setIsMobile(e.matches);
        };

        // Add the event listener for changes
        mediaQuery.addEventListener('change', handleMediaChange);

        // Clean up event listener on component unmount
        return () => mediaQuery.removeEventListener('change', handleMediaChange);

    }, []);

    useEffect(() => {
        const fetchProjects = async () => {

            const projects: Project[] = await getProjectListInOrder();
            setProjectObjects(projects);
            console.log(projects);
            console.log(projectObjects);

            // for (const projectId of projects){
            //     const oneProj: Project | null = await getProject(projectId);
            //     if (oneProj == null) continue;
            //     setProjectObjects(prevState => [...prevState, oneProj])
            // }
            // setProjectObjects[projects];
             
        };

        fetchProjects();
    }, []);


    console.log("dfgd")
    return (


        <Box className='body'>
            {/* <UserList /> */}
{/* 
            {
                
                !isMobile && (
                    <div>
                        
                        {
                        
                        projectObjects ? 
                        projectObjects.map(tile => {
                            if (!tile) return;
                            return (
                                <div key={tile.summary!}>
                                    <HomeTile projectId={tile.projectId!} />
                                    <Box className='home-spacer'></Box>
                                </div>
                                
                            );
                        }) : "egihuasadaisodfaosidh"}
                        
                    </div>
                )
            }

            {
                isMobile && (
                    <div>
                        {projectObjects.map(tile => {
                            return (
                                <div key={tile.projectId!}>
                                    <MediumWideImage projectId={tile.projectId!} />
                                    
                                    <Box className='mobile-home-spacer'></Box>
                                </div>
                                
                            );
                        })}

                    </div>

                )
            } */}


            <Footer></Footer>
        </Box>

    );

}



export default HomePage;