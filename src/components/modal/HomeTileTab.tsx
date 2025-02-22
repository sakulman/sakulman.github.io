import * as React from 'react';
import './Modal.css';
import { Input as AntInput, Space, Select, Button, Modal, message, Popconfirm, Form, Upload } from 'antd';
import { useState, useRef, useEffect } from 'react';
import DropZone from '../../pages/upload/dropzone/DropZone.tsx';
import { HomeTileForm } from '../../types/HomeTileForm.ts';
import { firestore, storage, uploadImage, writeProjectPhotos } from "../../firebase/firebase.tsx";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "@firebase/firestore";
import { v4 } from "uuid";
import { HomeTileType } from '../../enums/HomeTileType.ts';
import { Image, TextField } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form'
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface HomeTileTabProps {
    tileId: string | null;
    isModalOpen: boolean;
};


interface Positions {
    [key: number]: string;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const HomeTileTab: React.FC<HomeTileTabProps> = ({ tileId, isModalOpen, }: HomeTileTabProps) => {

    const { register } = useForm<HomeTileForm>();

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleFileChange = async (event) => {
        console.log("handle file change");
        const files: File[] = Array.from(event.target.files);
        let newFileList: UploadFile[] = await Promise.all(files.map(async (file) => {
            try {
                let newUrl: string = await uploadImage(file, file.name);
                return {
                    uid: v4(),
                    name: file.name,
                    status: 'done',
                    url: newUrl,
                    thumbUrl: newUrl,
                } as UploadFile;
            }
            catch (e) {
                console.error(e);
                return {
                    uid: v4(),
                    name: file.name,
                    status: 'error',
                } as UploadFile;
            }

        }));
        setFileList((prevFileList) => [...newFileList]);
    };

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );


    const [titleInputStatus, setTitleInputStatus] = useState<boolean>(false);
    const [yearInputStatus, setYearInputStatus] = useState<boolean>(false);
    const [descriptionInputStatus, setDescriptionInputStatus] = useState<boolean>(false);

    const [changedTitle, setChangedTitle] = useState<boolean>(false);
    const [changedYear, setChangedYear] = useState<boolean>(false);
    const [changedDescription, setChangedDescription] = useState<boolean>(false);
    const [changedImageUrl, setChangedImageUrl] = useState<boolean>(false);


    let HomeTileFormRef = new HomeTileForm();
    HomeTileFormRef.format = HomeTileType.Medium;
    const [formState, setFormState] = useState({ ...HomeTileFormRef });

    const HomeTilesRef = collection(firestore, "HomeTiles");


    const getImageFromDrop = (image: File) => {
        setFormState(prevState => ({ ...prevState, image: image }));
        setChangedImageUrl(true);
    };


    useEffect(() => {
        const fetchData = async () => {
            if (tileId != null) {
                const docRef = doc(firestore, "HomeTiles", tileId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const HomeTile: HomeTileForm = HomeTileForm.fromJson(docSnap.data());
                    setFormState(HomeTileForm.fromJson(docSnap.data()));
                    HomeTileFormRef = HomeTileForm.fromJson(formState);
                    setFileList([{
                        uid: "1",
                        name: "image.png",
                        url: HomeTile.imageUrl,
                    }]);

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

    const handleSelectChange = (value: string) => {
        HomeTileFormRef.format = value as HomeTileType;
        setFormState({ ...HomeTileFormRef });
        return;
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        switch (field) {
            case "title":
                setFormState(prevState => ({ ...prevState, title: e.target.value }));
                setTitleInputStatus(false);
                setChangedTitle(true);
                break;
            case "year":
                setFormState(prevState => ({ ...prevState, year: e.target.value }));
                setYearInputStatus(false);
                setChangedYear(true);
                break;
            case "description":
                setFormState(prevState => ({ ...prevState, description: e.target.value }));
                setDescriptionInputStatus(false);
                setChangedDescription(true);
                break;
            default:
                console.log("should not happen");
        }

        return;

    };

    const submitForm: SubmitHandler<HomeTileForm> = async (data) => {

    };

    return (
        <div>
            {tileId ? <h2>Edit Home Page Feature</h2> : <h2>Add Home Page Feature</h2>}

            <Space className='input-container' direction='vertical' size={10}>

                <TextField
                    {...register('title')}
                    label="Title"
                    error={titleInputStatus}
                    value={formState.title}
                    onChange={(e) => handleFormChange(e, "title")}
                    className='single-inputs'
                    placeholder="Title"
                    fullWidth
                />
                <TextField
                    {...register('year')}
                    label="Year"
                    error={yearInputStatus}
                    value={formState.year}
                    onChange={(e) => handleFormChange(e, "year")}
                    className='single-inputs'
                    placeholder="Year"
                    fullWidth
                />
                <TextField
                    {...register('description')}
                    label="Description"
                    error={descriptionInputStatus}
                    value={formState.description}
                    onChange={(e) => handleFormChange(e, "description")}
                    className='single-inputs'
                    placeholder="Short Description"
                    multiline
                    rows={4}
                    fullWidth
                />
                <Select
                    {...register('format')}
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
            {/* <DropZone sendImage={getImageFromDrop}></DropZone> */}
            <>
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                >
                    {fileList.length >= 1 ? null : uploadButton}
                </Upload>
               
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                

            </div>
            );

};

            export default HomeTileTab;

