import * as React from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import "./mobile-tile.css"
import { HomeTileForm } from '../../../types/HomeTileForm.ts';
import { useEffect, useState } from 'react';
import { Project } from '../../../types/Project.ts';
import { getProject } from '../../../firebase/firebase.tsx';
import { useNavigate } from 'react-router-dom';

const MobileTile: React.FC<{ project: Project }> = ({project}) =>   {

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
        <Grid className='home-row' container spacing={0}>
            <Grid size={1}></Grid>
            <Grid className='image-tile' size={10}>
                <img className='image' onClick={navigateToProject} src={project ? project.displayImage : ''} />
            </Grid>
            <Grid size={1}></Grid>
            <Grid size={1}></Grid>
            <Grid className='descriptor-text' size={11}>
                <Box className='text-title'>
                    <h1 className='clickable-title' onClick={navigateToProject}>{project ? project.title : ''}</h1>
                    <em>{project ? project.date : ''}</em>
                </Box>


            </Grid>
            <Grid size={1}></Grid>
            <Grid size={10}>

                <p className='mobile-text-desc'>{project ? project.summary : ''}</p>

            </Grid>
            <Grid size={1}></Grid>
        </Grid>

    );


}

export default MobileTile;