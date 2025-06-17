import axios from 'axios';
import { Project } from '../types/Project.ts';
import { ProjectImage, ProjectImageList } from '../types/Image.ts';


const baseUrl: string = process.env.NODE_ENV === 'development'
? 'http://localhost:5111/api'
: 'https://portfolio-8f239-f5b9fsfwfmfkeyf6.westus2-01.azurewebsites.net/api'

export const getAllProjects = async (): Promise<Project[]> => {

    const allProjectJson = await axios.get<Project[]>(`${baseUrl}/projects`);
    return allProjectJson.data;
}


export const createNewProject = async(project: Project): Promise<Project | null> => {

    const projectJson = project.toJson();
    try{
        const postedProject = await axios.post(`${baseUrl}/projects`, projectJson);
        return Project.fromJson(postedProject.data);
    }
    catch (error){
        return null;
    }
    
}

export const updateProject = async(project: Project): Promise<Project | null> => {
    try{
        return null;
    }
    catch (error){
        return null;
    }
}

export const getImagesForProject = async(projectId: string): Promise<ProjectImageList> => {
    try {
        const allImagesForProject = await axios.get<ProjectImageList>(`${baseUrl}/images/${projectId}`);
        return allImagesForProject.data;
    }
    catch (error){
        return new ProjectImageList();
    }
}

export const uploadImagesForProject = async(ProjectImages): Promise<ProjectImageList> => {
    try {
        const uploadImages = await axios.post<ProjectImageList>(`${baseUrl}/images`);
        return uploadImages.data;

    }
    catch (error){
        return new ProjectImages();
    }

    
}