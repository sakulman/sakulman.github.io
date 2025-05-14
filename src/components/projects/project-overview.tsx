import React, { useEffect, useState } from 'react';
import { Grid2 as Grid } from '@mui/material';
import "./project-overview.css";
import { Project } from '../../types/Project';
import { getProject } from '../../firebase/firebase.tsx';

const ProjectOverview: React.FC<{ projectId: string, thisProject: Project | undefined }> = ({ projectId, thisProject }) => {


    // const [project, setProject] = useState<Project>();


    // useEffect(() => {
    //     const fetchProjectData = async () => {
    //         var currentProject: Project | null = await getProject(projectId);

    //         if (currentProject != null) {
    //             setProject(currentProject);
    //         }
            
    //     };

    //     fetchProjectData();
    // });

    return (
        <Grid className="project-overview-container" container spacing={2}>

            <Grid size={2}></Grid>
            <Grid size={8}>
                <div className='project-overview-image-container'>
                    <img className="project-overview-image" style={{ width: "100%" }} src={thisProject?.displayImage ? thisProject.displayImage : ''}></img>
                    <div className="project-overview-location"><em>{thisProject?.location ? thisProject.location : ''}</em></div>
                </div>



            </Grid>
            <Grid size={2}></Grid>
            <Grid size={2}></Grid>
            <Grid size={8}>
                <div className='project-overview-spacer'></div>
                <div className='project-overview-description'>
                    <p>{thisProject?.longDescription ? thisProject.longDescription : ''}</p>
                </div>
            </Grid>

        </Grid>
    );
}

export default ProjectOverview;