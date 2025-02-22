import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, collection, updateDoc, getDoc } from "@firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";


const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
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
  try{
    const imageRef = ref(storage, `images/${v4() + name}`);
    const snapshot = await uploadBytes(imageRef, image);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  }
  catch(e){
    console.error(e);
  }
  return Promise.reject("error");
};

export const writeProjectPhotos = async(projectId: string, urls: string[]) => {
  // add the urls to the project document
  const hometileDocRef = doc(firestore, 'HomeTiles', projectId);
  updateDoc(hometileDocRef, {ProjectPhotos: urls});
};

export const getProjectPhotos = async(projectId: string): Promise<string[]> => {
  const hometileDocRef = doc(firestore, 'HomeTiles', projectId);
  const docSnap = await getDoc(hometileDocRef);
  if(docSnap.exists()){
    const data = docSnap.data();
    return data.ProjectPhotos;
  }
  return [];
};
  