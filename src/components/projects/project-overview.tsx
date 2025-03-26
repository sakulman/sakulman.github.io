import React from 'react';
import { Grid2 as Grid } from '@mui/material';
import "./project-overview.css";

const ProjectOverview: React.FC<{ projectId: string, imageUrl: string, }> = ({ projectId, imageUrl }) => {
    return (
        <Grid className="project-overview-container" container spacing={2}>

            <Grid size={2}></Grid>
            <Grid size={8}>
                <div className='project-overview-image-container'>
                    <img className="project-overview-image" style={{ width: "100%" }} src={imageUrl}></img>
                    <div className="project-overview-location"><em>Florence, Italy</em></div>
                </div>



            </Grid>
            <Grid size={2}></Grid>
            <Grid size={2}></Grid>
            <Grid size={8}>
                <div className='project-overview-spacer'></div>
                <div className='project-overview-description'>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </Grid>

        </Grid>
    );
}

export default ProjectOverview;