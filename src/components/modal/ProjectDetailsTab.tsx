import * as React from 'react';
import './Modal.css';
import { Input as AntInput, Space, Select, Button } from 'antd';
import { useState, useRef, useEffect } from 'react';
import DropZone from '../../pages/upload/dropzone/DropZone.tsx';
import { HomeTileForm } from '../../types/HomeTileForm.ts';
import { firestore, storage, uploadImage, writeProjectPhotos } from "../../firebase/firebase.tsx";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "@firebase/firestore";
import { HomeTileType } from '../../enums/HomeTileType.ts';
import { SubmitHandler, useForm } from 'react-hook-form'
import { TextField } from '@mui/material';
import { ModalFormTab } from '../../types/ModalFormTab.ts';

interface ProjectDetailProps {
    projectId: string | null;
    isModalOpen: boolean;
    updated: (newForm: ModalFormTab, key: String) => void;
};


interface Positions {
    [key: number]: string;
};


const ProjectDetailsTab: React.FC<ProjectDetailProps> = ({ projectId, isModalOpen, updated,  }: ProjectDetailProps) => {

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
            if (projectId != null) {
                const docRef = doc(firestore, "HomeTiles", projectId);
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

    }, []);

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
            const docRef = doc(firestore, "HomeTiles", projectId!);
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
            {projectId ? <h2>Edit Project Details</h2> : <h2>Add Project Details</h2>}

            <Space className='input-container' direction='vertical' size={10}>

                <TextField
                    {...register('title')}
                    label="Title"
                    className='single-inputs'
                    placeholder="Title"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    {...register('year')}
                    label="Year"
                    className='single-inputs'
                    placeholder="Year"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    
                />
                <TextField
                    {...register('description')}
                    label="Description"
                    className='single-inputs'
                    placeholder="Short Description"
                    multiline  // for some reason having multiline here causes an MUI bug
                    rows={4}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
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

            export default ProjectDetailsTab;

