import React, { useEffect, useState } from 'react';
import { Box, Grid2 as Grid, ImageList, ImageListItem } from '@mui/material';
import { Tabs, Image, Space } from 'antd';
import "./project.css";
import ProjectOverview from '../../components/projects/project-overview.tsx';
import { getProjectPhotos } from '../../firebase/firebase.tsx';
import { v4 } from 'uuid';
import ProjectImages from '../../components/projects/project-images.tsx';


const ProjectPage: React.FC<{ projectId: string }> = ({ projectId }) => {
 
    
    return (
        <Grid className="project-page-container" container style={{ display: 'flex' }} spacing={2}>
            <Grid size={5}></Grid>
            <Grid className='project-title' size={2}>
                <h1 className='project-title-text'>Project</h1>
            </Grid>
            <Grid size={5}></Grid>
            {/* <Grid size={2}></Grid> */}
            <Grid size={12}>
                <div className='project-page-main'>
                    <Tabs tabPosition={'left'} size='large'>
                        <Tabs.TabPane tab="Overview" key="1">
                            <ProjectOverview projectId={projectId} imageUrl='https://firebasestorage.googleapis.com/v0/b/portfolio-8f239.firebasestorage.app/o/images%2F9613ee64-89be-436a-bec1-4e86eb68573675_22609_00_N24_weblg-2140x1203.jpg?alt=media&token=09e0b648-e284-4453-9354-19048dd55432' />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Images" key="2">
                            <ProjectImages projectId={projectId} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Tab 3" key="3">
                            Content of Tab 3
                        </Tabs.TabPane>
                    </Tabs>
                </div>


            </Grid>
            {/* <Grid size={2}></Grid> */}

        </Grid>
    );
};

export default ProjectPage