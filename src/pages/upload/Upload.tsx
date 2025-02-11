import * as React from 'react';
import './Upload.css';
import { Input as AntInput, Space, Select, Button } from 'antd';
import { useState, useCallback, useRef } from 'react';
import {  Grid2 as Grid } from '@mui/material';
import Dropzone, { useDropzone } from 'react-dropzone'
import DropZone from './dropzone/DropZone.tsx';
import { HomeTileForm } from '../../types/HomeTileForm.ts';
import { firestore, storage } from "../../firebase/firebase.tsx";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "@firebase/firestore";
import { v4 } from "uuid";
import { HomeTileType } from '../../enums/HomeTileType.ts';
import { create } from '@mui/material/styles/createTransitions';
import '../../services/cloud.ts';
import { uploadImage } from '../../services/cloud.ts';


const { TextArea } = AntInput;
interface Positions {
    [key: number]: string;
}

function Upload() {

    const positionData = useRef<Positions[]>([]);


    const HomeTileFormRef = new HomeTileForm();
    HomeTileFormRef.format = HomeTileType.Medium;
    const [formState, setFormState] = useState({ ...HomeTileFormRef });

    const HomeTilesRef = collection(firestore, "HomeTiles");


    const getImageFromDrop = (image: File) => {
        HomeTileFormRef.image = image;
    };


    const getNewPosition = async (): Promise<number> => {
        console.log(positionData.current);
        const docSnapshot = await getDocs(HomeTilesRef);
        let highestPosition: number = 0;

        docSnapshot.forEach((doc) => {
            const homeTileForm = HomeTileForm.fromJson(doc.data());
            if (homeTileForm.position && homeTileForm.position! > highestPosition) {
                highestPosition = homeTileForm.position!;
            }
        });

        return highestPosition + 1;


    };


    const submitForm = async () => {
        console.log("submitting form");
        if (HomeTileFormRef == null) {
            return;
        }
        if (HomeTileFormRef.image == null) {
            console.log("image is null");
            return;
        }
        console.log("in submit form");
        let newUrl: string | null = await uploadImage(HomeTileFormRef);
        if (newUrl == null) {
            console.log("url is null");
            return;
        }
        HomeTileFormRef.imageUrl = newUrl;

        try {
            HomeTileFormRef.position = await getNewPosition();
            console.log(HomeTileFormRef);
            const created = await addDoc(HomeTilesRef, HomeTileFormRef!.toJson());
        } catch (e) {
            console.log("error adding document: " + e);
        };
        HomeTileFormRef.title = "";
        HomeTileFormRef.year = "";
        HomeTileFormRef.description = "";
        HomeTileFormRef.format = HomeTileType.Medium; // Default value
        HomeTileFormRef.image = undefined;
        HomeTileFormRef.imageUrl = "";

        setFormState({ ...HomeTileFormRef });

    };

    const handleSelectChange = (value: string) => {
        HomeTileFormRef.format = value as HomeTileType;
        return;
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        switch (field) {
            case "title":
                HomeTileFormRef.title = e.target.value;
                break;
            case "year":
                HomeTileFormRef.year = e.target.value;
                break;
            case "description":
                HomeTileFormRef.description = e.target.value;
                break;
            default:
                console.log("should not happen");
        }
        return;

    };

    return (
        <div>
            <h2>Edit Home Page Feature</h2>

            <Space className='input-container' direction='vertical' size={10}>
                <AntInput value={HomeTileFormRef.title} onChange={(e) => handleFormChange(e, "title")} className='single-inputs' placeholder="Title" />

                <AntInput value={HomeTileFormRef.year} onChange={(e) => handleFormChange(e, "year")} className='single-inputs' placeholder="Year" />

                <TextArea value={HomeTileFormRef.description} onChange={(e) => handleFormChange(e, "description")} placeholder='Short Description'></TextArea>
                <Select
                    defaultValue="medium"
                    style={{ width: 120 }}
                    onChange={handleSelectChange}
                    options={[
                        { value: 'tall', label: 'tall' },
                        { value: 'square', label: 'square' },
                        { value: 'medium', label: 'wide' },
                        { value: 'wide', label: 'ultra-wide' },
                    ]}
                />
            </Space>
            <DropZone sendImage={getImageFromDrop}></DropZone>

            <Button onClick={submitForm}>Submit</Button>
        </div>



    );

}

export default Upload;