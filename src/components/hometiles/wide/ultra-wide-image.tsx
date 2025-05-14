import * as React from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import "./ultra-wide-image.css"
import { HomeTileForm } from '../../../types/HomeTileForm.ts';
import { useEffect, useState } from 'react';
import { getProject } from '../../../firebase/firebase.tsx';
import { Project } from '../../../types/Project.ts';
import { useNavigate } from 'react-router-dom';


const UltraWideImage: React.FC<{ project: Project }> = ({project}) => {

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
        <Grid className='home-row' container spacing={2}>
            <Grid size={1}></Grid>
            <Grid className='image-tile' size={10}>
                <img className='image' onClick={navigateToProject} src={project ? project.displayImage : ''} />
            </Grid>
            <Grid size={1}></Grid>
            <Grid size={3}></Grid>
            <Grid className='descriptor-text' size={6}>
                <Box className='text-title'>
                    <h1 className='clickable-title' onClick={navigateToProject}>{project ? project.title : ''}</h1> 
                    <p>{project ? project.date : ''}</p>
                </Box>
                <Box className='wide-text-desc'>
                    <p>{project ? project.summary : ''}</p>
                </Box>
                
            </Grid>
            <Grid size={3}></Grid>
        </Grid>

    );


}

export default UltraWideImage;