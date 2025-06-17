// import * as React from 'react';
// import { HomeTileForm } from '../types/HomeTileForm';
// import { firestore, storage, functions } from "../firebase/firebase.tsx";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "@firebase/firestore";
// import { v4 } from "uuid";
// import { httpsCallable } from 'firebase/functions';


// const HomeTilesRef = collection(firestore, "HomeTiles");

// export const uploadImage = async (image: File,form: HomeTileForm): Promise<string | null> => { 
//     console.log("submitting form");
//         if (form == null) {
//             return "";
//         }
//         if (image == null) {
//             console.log("image is null");
//             return null;
//     }
//     console.log("here");
//     // const imageRef = ref(storage, `images/${v4() + form.image.name}`);
//     // const snapshot = await uploadBytes(imageRef, form.image);
//     // const url = await getDownloadURL(snapshot.ref);
//     const uploadImageCloudCall = httpsCallable(functions, 'uploadImage');
//     try {
//         const result = await uploadImageCloudCall(
//             {
                
//             }
//         );
//         console.log(result);
//     } catch (e) {   
//         console.error(e);
//     }
//     return "";

// };