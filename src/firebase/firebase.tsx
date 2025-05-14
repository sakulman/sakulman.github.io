import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, collection, updateDoc, getDoc, getDocs } from "@firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { ProjectDetails } from "../types/ProjectDetails.ts";
import { HomeTileForm } from "../types/HomeTileForm.ts";
import { HomeTileType } from "../enums/HomeTileType.ts";
import { Project } from "../types/Project.ts";
import { setDoc } from "firebase/firestore";
import { SelectedWorksOrder } from "../types/SelectedWorksOrder.ts";


const firebaseConfig = {
  apiKey: `AIzaSyCI3ut2ToC4OZUCXxW-pbSsQiPFjFwxH0s`,
  authDomain: "portfolio-8f239.firebaseapp.com",
  projectId: "portfolio-8f239",
  storageBucket: "portfolio-8f239.firebasestorage.app",
  messagingSenderId: "131312560188",
  appId: "1:131312560188:web:488e81cd2649951d163b39",
  measurementId: "G-21DDRLJ91Y"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export const uploadImage = async (image: File, name: string): Promise<string> => {
  try {
    const imageRef = ref(storage, `images/${v4() + name}`);
    const snapshot = await uploadBytes(imageRef, image);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  }
  catch (e) {
    console.error(e);
  }
  return Promise.reject("error");
};

export const getProjects = async (): Promise<Project[]> => {
  try{
    const querySnapshot = await getDocs(collection(firestore, "Projects"));
    const projectList: Project[] = [];
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      projectList.push(Project.fromJson(data));
    });
    return projectList;
  } catch (e){
    console.log(e);
    return [];
  }
}

export const getProjectOrder = async (): Promise<string[]> => {
  try{
    const docRef = doc(firestore, "ProjectData", "HomeTileOrder");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()){
      const listOfProjects: string[] = docSnap.data()['list'];
      return listOfProjects;
    }
    
  } catch(error){
    console.log(error);
  }
  return [];
}

export const writeProjectOrder = async (listOfProjects: string[]): Promise<boolean> => {
  try{
    const docRef = doc(firestore, "ProjectData", "HomeTileOrder");
    await setDoc(docRef, { ['list']: listOfProjects}, { merge: true });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const writeProjectToFirestore = async (proj: Project): Promise<boolean> => {
  try {
    if (!proj.projectId){
      return false;
    }

    // upload the project data
    const docRef = doc(firestore, "Projects", proj.projectId!);
    await setDoc(docRef, proj.toJson());

    // add it to the project order 
    const projectList: string[] = await getProjectOrder();
    projectList.push(proj.projectId);
    return await writeProjectOrder(projectList);
  } catch (e) {
    console.log(e);
    return false;
  }

};

export const writeProjectPhotos = async (projectId: string, urls: string[]) => {
  // add the urls to the project document
  const hometileDocRef = doc(firestore, 'HomeTiles', projectId);
  updateDoc(hometileDocRef, { ProjectPhotos: urls });
};

export const getProject = async (projectId: string): Promise<Project | null> => {
  const projectDocRef = doc(firestore, 'Projects', projectId);
  const docSnap = await getDoc(projectDocRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const newProjectDetails: Project = Project.fromJson(data);
    return newProjectDetails;
  }
  return null;
}

export const getProjectListInOrder = async (): Promise<Project[]> => {
  const projectOrderRef = doc(firestore, 'ProjectData', 'HomeTileOrder');
  const projectOrderDocSnap = await getDoc(projectOrderRef);
  if (!projectOrderDocSnap.exists()) return [];
  const projectOrder: string[] = projectOrderDocSnap.data().list as string[];
  const projectList: Project[] = [];
  for (const proj of projectOrder){
    const newProj: Project | null = await getProject(proj);
    if (newProj == null) continue;
    projectList.push(newProj!);
  }
  return projectList;
}

export const getProjectPhotos = async (projectId: string): Promise<string[]> => {
  const projectDocRef = doc(firestore, 'Projects', projectId);
  const docSnap = await getDoc(projectDocRef);
  if (docSnap.exists()) {
    const data = docSnap.data();

    console.log(data.images);
    return data.images;
  }
  return [];
};

interface projectIdWithUrl {
  url: string;
  id: string;
};

export const getProjectForEditorTile = async (projectId: string): Promise<Project | null> => {
  const projectDocRef = doc(firestore, 'Projects', projectId);
  const docSnap = await getDoc(projectDocRef);
  if (docSnap.exists()) { 
    const data = docSnap.data();
    return Project.fromJson(data);
  }
  return null;
}

export const getProjectUrls = async (): Promise<projectIdWithUrl[]> => {
  const projectCollectionRef = collection(firestore, 'Projects');
  const querySnapshot = await getDocs(projectCollectionRef);

  const urls: projectIdWithUrl[] = [];

  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    const url: string = docData.url;
    const id: string = doc.id;
    urls.push({ url, id });
  })
  return urls;

}

export const createSelectedWorksList = async (): Promise<SelectedWorksOrder[]> => {

  const projects: Project[] = await getProjects();

  var order: SelectedWorksOrder[] = [];
  
  projects.forEach(project => {
    const thisProj: SelectedWorksOrder = [
      project.year ? project.year : 0, 
      project.title ? project.title : '',
      project.displayImage ? project.displayImage : '',
      project.projectId ? project.projectId : '',
      project.url ? project.url : ''
    ];
    order.push(thisProj);
  })
  order.sort((a, b) => b[0] - a[0]);

  return order;
}


