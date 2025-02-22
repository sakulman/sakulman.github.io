import React, { useEffect, useState } from 'react';
import "./Modal.css";
import { getProjectPhotos } from '../../firebase/firebase.tsx';
import type { UploadFile } from 'antd';
import { v4 } from 'uuid';

interface ProjectPhotoProps {
  projectId: string;
  updated: (files: string[]) => void;
}

const ProjectPhotos: React.FC<ProjectPhotoProps> = ({projectId, updated}) => {

    const [projectPhotos, setProjectPhotos] = useState<string[]>([]);

    useEffect(() => {
        const fetchProjectPhotos = async () =>{
          let urls: string[] = await getProjectPhotos(projectId);
          let newFileList = urls.map((url) => {
            return {
              uid: v4(),
              name: url,
              status: 'done',
              url: url,
              thumbUrl: url,
            } 
          });
          setProjectPhotos(urls);
        };
        fetchProjectPhotos();
      }, []);

    return (
        <div>
            <h2>Project Photos</h2>
        </div>

    );
};

export default ProjectPhotos;