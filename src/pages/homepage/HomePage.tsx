import { Box, Grid2 as Grid } from '@mui/material';
import * as React from 'react';
import "./HomePage.css"
import MediumWideImage from '../../components/hometiles/medium/medium-wide-image.tsx';
import Footer from '../../components/footer/footer.tsx';
import { useEffect, useState } from 'react';
import MobileTile from '../../components/hometiles/mobile/mobile-tile.tsx';
import { firestore, getProject, getProjectListInOrder, getProjectOrder, storage } from "../../firebase/firebase.tsx";
import { Project } from '../../types/Project.ts';
import HomeTile from '../../components/hometiles/hometile.tsx';
import axios from 'axios';
import { createNewProject, uploadImagesForProject } from '../../services/database.ts';
import { ProjectImage } from '../../types/Image.ts';

function HomePage() {

    const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 1000px)').matches);

    const [projectObjects, setProjectObjects] = useState<Project[]>([]);

    const [rerender, setRerender] = useState<number>(0);

    useEffect(() => {

        const testBackend = async () => {
            const jsonData = {
                Title: "test now",
                Date: "2025",
                Year: 2025,
                Format: "Wide",
                Location: "fake location",
                Url: "json",
                DisplayImage: "https://firebasestorage.googleapis.com/v0/b/portfolio-8f239.firebasestorage.app/o/images%2F9eff3a45-434e-4867-864d-34556cd76462site-plan2-ps.png?alt=media&token=efbad608-d693-4761-9120-1d315c2aea60",
                Summary: "Summary",
                LongDescription: "Long ahh description"
            };
            const testProject: Project = Project.fromJson(jsonData);
            const testuploadproject = await createNewProject(testProject);
            // const i1 = new ProjectImage(1, 1, 1, "url");
            // const i2 = new ProjectImage(2, 1, 2, "url");
            const testImages: ProjectImage[] = [
                
                

            ];
            const testUploadImages = await uploadImagesForProject(testImages);
            return;
            // const testGet = await axios.get('https://portfolio-8f239-f5b9fsfwfmfkeyf6.westus2-01.azurewebsites.net/api/Projects');
            // const testGetData = testGet.data;
        }

        testBackend();
     
    }, [])

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
    return (


        <Box className='body'>
            {/* <UserList /> */}

            {
                
                !isMobile && (
                    <div>
                        
                        {
                        
                        projectObjects ? 
                        projectObjects.map(tile => {
                            if (!tile) return;
                            return (
                                <div key={tile.summary!}>
                                    <HomeTile project={tile} />
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
                                    <MediumWideImage project={tile} />
                                    
                                    <Box className='mobile-home-spacer'></Box>
                                </div>
                                
                            );
                        })}

                    </div>

                )
            }


            <Footer></Footer>
        </Box>

    );

}



export default HomePage;