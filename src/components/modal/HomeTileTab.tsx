import * as React from 'react';
import './Modal.css';
import { Input as AntInput, Space, Select, Button, Modal, message, Popconfirm, Form, Upload } from 'antd';
import { useState, useRef, useEffect } from 'react';
import DropZone from '../../pages/upload/dropzone/DropZone.tsx';
import { HomeTileForm } from '../../types/HomeTileForm.ts';
import { firestore, storage, uploadImage, writeProjectPhotos } from "../../firebase/firebase.tsx";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "@firebase/firestore";
import { HomeTileType } from '../../enums/HomeTileType.ts';
import { SubmitHandler, useForm } from 'react-hook-form'
import { TextField } from '@mui/material';
import { ModalFormTab } from '../../types/ModalFormTab.ts';

interface HomeTileTabProps {
    tileId: string | null;
    isModalOpen: boolean;
    updated: (newForm: ModalFormTab, key: String) => void;
};


interface Positions {
    [key: number]: string;
};


const HomeTileTab: React.FC<HomeTileTabProps> = ({ tileId, isModalOpen, updated,  }: HomeTileTabProps) => {

    const { register, setValue, handleSubmit } = useForm<HomeTileForm>();

    const HomeTilesRef = collection(firestore, "HomeTiles");

    const getImageFromDrop = async (image: File) => {
        // setFormState(prevState => ({ ...prevState, image: image }));
        // setChangedImageUrl(true);
        let newFileUrl: string = await uploadImage(image, image.name);
        setValue('imageUrl', newFileUrl);
    };


    useEffect(() => {
        const fetchData = async () => {
            if (tileId != null) {
                const docRef = doc(firestore, "HomeTiles", tileId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const HomeTile: HomeTileForm = HomeTileForm.fromJson(docSnap.data());
                    
                    setValue('title', HomeTile.title);
                    setValue('year', HomeTile.year);
                    setValue('description', HomeTile.description);
                    setValue('format', HomeTile.format);
                    setValue('imageUrl', HomeTile.imageUrl);
                    
                }
                else {
                    setValue('format', HomeTileType.Medium);
                    let newPosition = await getNewPosition();
                    setValue('position', newPosition);
                }
            }
            return;
        }

        fetchData();

    }, [isModalOpen]);

    const positionData = useRef<Positions[]>([]);

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

    // const handleSelectChange = (value: string) => {
    //     HomeTileFormRef.format = value as HomeTileType;
    //     setFormState({ ...HomeTileFormRef });
    //     return;
    // };
    const [loadings, setLoadings] = useState<boolean>(false);
    
    const submitForm: SubmitHandler<HomeTileForm> = async (data) => {
        setLoadings(true);
        console.log(register('title'));
        console.log(register('year'));
        console.log(register('description'));
        console.log(register('format'));
        console.log(register('imageUrl'));
        try {
            const docRef = doc(firestore, "HomeTiles", tileId!);
            await updateDoc(docRef, {
                title: register('title'), year: register('year'),
                description: register('description'), format: register('format'),
                imageUrl: register('imageUrl')
            });
        } catch (e) {
            console.error(e);
        }
        
        setLoadings(false);
    };

    return (
        <div>
            {tileId ? <h2>Edit Home Page Feature</h2> : <h2>Add Home Page Feature</h2>}

            <Space className='input-container' direction='vertical' size={10}>

                <TextField
                    {...register('title')}
                    label="Title"
                    className='single-inputs'
                    placeholder="Title"
                    fullWidth
                />
                <TextField
                    {...register('year')}
                    label="Year"
                    className='single-inputs'
                    placeholder="Year"
                    fullWidth
                    
                />
                <TextField
                    {...register('description')}
                    label="Description"
                    className='single-inputs'
                    placeholder="Short Description"
                    multiline
                    rows={4}
                    fullWidth
                />
                <Select
                    {...register('format')}
                    style={{ width: 120 }}
                    options={[
                        { value: 'tall', label: 'tall' },
                        { value: 'square', label: 'square' },
                        { value: 'medium', label: 'wide' },
                        { value: 'wide', label: 'ultra-wide' },
                    ]}
                />
            </Space>
            <DropZone sendImage={getImageFromDrop}></DropZone>
            <Button key="submit" type="primary" loading={loadings} onClick={handleSubmit(submitForm)}>
                    Submit
            </Button>
                

            </div> 
            );

};

            export default HomeTileTab;

