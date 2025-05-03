import { useEffect, useState } from 'react';
import * as React from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import { Project } from '../../types/Project';
import { getProject } from '../../firebase/firebase.tsx';
import { HomeTileType } from '../../enums/HomeTileType.ts';
import MediumWideImage from './medium/medium-wide-image.tsx';
import SquareImage from './square/square-image.tsx';
import UltraWideImage from './wide/ultra-wide-image.tsx';


const HomeTile: React.FC<{ project: Project }> = ({project}) =>  {

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

    if (project!.format == HomeTileType.Medium) {
        return <MediumWideImage project={project!} />
    }
    else if (project!.format == HomeTileType.Square) {
        return <SquareImage project={project!} />
    }
    else if (project!.format == HomeTileType.Wide) {
        return <UltraWideImage project={project!} />
    }
    else {
        return <></>
    }



}

export default HomeTile;