import React, { useEffect, useState } from 'react';
import { Box, Grid2 as Grid, ImageList, ImageListItem } from '@mui/material';
import { Tabs, Image, Space } from 'antd';
import "./project.css";
import ProjectOverview from '../../components/projects/project-overview.tsx';
import { getProject, getProjectPhotos } from '../../firebase/firebase.tsx';
import { v4 } from 'uuid';
import ProjectImages from '../../components/projects/project-images.tsx';
import { Project } from '../../types/Project.ts';


const ProjectPage: React.FC<{ projectId: string }> = ({ projectId }) => {

    const [project, setProject] = useState<Project>();

    useEffect(() => {
        const fetchProject = async () => {

            const thisProject: Project | null = await getProject(projectId);

            if (thisProject != null) {
                setProject(thisProject);
            }
            else {
                setProject(undefined);
            }


        };
        fetchProject();
    }, []);


    return (
        <Grid className="project-page-container" container style={{ display: 'flex' }} spacing={2}>
            <Grid size={5}></Grid>
            <Grid className='project-title' size={2}>
                <h1 className='project-title-text'>{project ? project.title : ''}</h1>
            </Grid>
            <Grid size={5}></Grid>
            {/* <Grid size={2}></Grid> */}
            <Grid size={12}>
                <div className='project-page-main'>
                    <Tabs tabPosition={'left'} size='large'>
                        <Tabs.TabPane tab="Overview" key="1">
                            <ProjectOverview projectId={projectId} thisProject={project ? project : undefined} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Images" key="2">
                            <ProjectImages projectId={projectId} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Details" key="3">
                            Coming soon
                        </Tabs.TabPane>
                    </Tabs>
                </div>


            </Grid>
            {/* <Grid size={2}></Grid> */}

        </Grid>
    );
};

export default ProjectPage