import * as React from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import "./square-image.css"
import { useEffect, useState } from 'react';
import { Project } from '../../../types/Project';
import { getProject } from '../../../firebase/firebase.tsx';
import { useNavigate } from 'react-router-dom';


const SquareImage: React.FC<{ project: Project }> = ({project}) =>  {

    // const [project, setProject] = useState<Project>();

    // useEffect( () => {
    //     const initialize = async () =>{
    //         const proj: Project | null = await getProject(projectId);
    //         if (project != null) {
    //             setProject(proj!);
    //         }
    //         return;
    //     }
    //     initialize();

    // }, [])

    const nav = useNavigate();

    const navigateToProject = () => {
        if (project.url){
            nav(`/projects/${project.url}`);
        }
        
    }

    return (
        <Grid className='home-row' container spacing={4}>
            <Grid size={1}></Grid>
            
            
            <Grid className='image-tile' size={7}>
                <img className='medium-image' onClick={navigateToProject} src={project ? project.displayImage : ''} />
            </Grid>
            <Grid  size={2}>
                <Box className='square-descriptor-text'>
                    <Box className='text-title'>
                        <h1 className='clickable-title' onClick={navigateToProject}>
                            {project ? project.title : ''}
                        </h1> 
                        <p className='clickable-title'>{project ? project.date : ''}</p>
                </Box>
                <Box className='square-text-desc'>
                        <p>{project ? project.summary : ''}</p>
                </Box>
                </Box>
                
                
            </Grid>
            <Grid size={2}></Grid>
        </Grid>

    );


}

export default SquareImage;