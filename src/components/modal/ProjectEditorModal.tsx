import * as React from 'react';
import './Modal.css';
import { Input as AntInput, Space, Select, Button, Modal, message, Popconfirm, Form, Upload, UploadFile } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { firestore, getProject, getProjectPhotos, storage, uploadImage, writeProjectPhotos, writeProjectToFirestore } from "../../firebase/firebase.tsx";
import { v4 } from "uuid";
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Project } from '../../types/Project.ts';
import { TextField } from '@mui/material';
import DropZone from '../../pages/upload/dropzone/DropZone.tsx';
import { Reorder } from 'framer-motion';
import { UploadOutlined } from '@ant-design/icons';
import { HomeTileType } from '../../enums/HomeTileType.ts';

// add: individual submit for each tab, looks the same for all of them
// when exiting a tab, save

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface ModalComponentProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  projectId: string | null;
  reRender: () => void;
}

const ProjectEditorModal: React.FC<ModalComponentProps> = ({ isModalOpen, handleCancel, handleOk, projectId, reRender }: ModalComponentProps) => {


  const { register, control, formState, watch, setValue, handleSubmit, getValues } = useForm<Project>({
    defaultValues: { 
      year: 2025, 
      format: HomeTileType.Medium,
      images: [],
      displayImage: '',
      title: '',
      date: '',
      summary: '',
      longDescription: '',
      url: '',
      location: ''
    }
  }
  );

  // on image upload, get the urls and setValue
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setFileList((prevFileList) => [...prevFileList, ...newFileList]);
  };

  const handleRemove = (file: UploadFile) => {
    console.log(fileList);
    // setFileList((prevFileList) => prevFileList.filter((file) => file.status !== 'removed'));
    const updatedFileList: UploadFile[] = removeDeleted();
    let urls: string[] = fileList
      .filter((file) => file.status === 'done')
      .map((file) => file.url).filter(
        (url) => url !== undefined) as string[];
    console.log(urls);
  };
  const removeDeleted = (): UploadFile[] => {
    const filtered: UploadFile[] = fileList.filter((file) => file.status != "removed");
    setFileList(filtered);
    return filtered;
  }

  const handleReorder = (newFileList) => {
    console.log('Reordered list:', newFileList);
    setFileList(newFileList);
  };

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const submitPhotos = async () => {

    // upload the images to firebase and set the images[] to the list of their urls

    const imageUrls: string[] = fileList.map(file => file.url!);

    const currentImages = watch("images")! as string[] | [];

    setValue('images', [...currentImages, ...imageUrls]);

    // const docRef = doc(firestore, "Projects", projectId!);
    // let urls: string[] = fileList
    // .filter((file) => file.status === 'done')
    // .map((file) => file.url).filter(
    //     (url) => url !== undefined) as string[];
    // console.log(urls);
    // try{
    //   await setDoc(docRef, {
    //     project_photos: urls
    //   },
    //   { merge: true });
    // } catch(e) {
    //   console.log(e);
    // }

  };


  const [loadings, setLoadings] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (errorMessage) {
      message.error(errorMessage);
      setErrorMessage(null); // Reset the error message after displaying it
    }
  }, [errorMessage]);


  const getImageFromDrop = async (image: File) => {

    let newFileUrl: string = await uploadImage(image, image.name);
    setValue('displayImage', newFileUrl);
  };

  useEffect(() => {

    const fetchProject = async () => {
      
      const thisProj: Project | null = await getProject(projectId!);
      if (thisProj == null) {
        return;
      }
      setValue('projectId', projectId!, { shouldDirty: false });
      setValue('title', thisProj.title, { shouldDirty: false });
      setValue('year', thisProj.year, { shouldDirty: false });
      setValue('date', thisProj.date, { shouldDirty: false });
      setValue('location', thisProj.location, { shouldDirty: false });
      setValue('summary', thisProj.summary, { shouldDirty: false });
      setValue('longDescription', thisProj.longDescription, { shouldDirty: false });
      setValue('displayImage', thisProj.displayImage, { shouldDirty: false });
      setValue('images', thisProj.images, { shouldDirty: false });
      setValue('format', thisProj.format, { shouldDirty: false });
      setValue('url', thisProj.url, { shouldDirty: false });

    }
    if (projectId != null) {
      fetchProject();
    } else {
      setValue('projectId', v4(), { shouldDirty: false });
    }

  }, []);


  const submitForm: SubmitHandler<Project> = async (data) => {
    try {
      console.log("submitting");
      const imageUrls: string[] = fileList.map(file => file.url!);
      const currentImages = watch("images")! as string[] | [];
      setValue('images', [...currentImages, ...imageUrls]);
      const projectForm: Project = Project.fromJson(getValues());
      await writeProjectToFirestore(projectForm);

    } catch (e) {

    }
  }


  return (
    <Modal open={isModalOpen} closable={false} footer={[
      <Popconfirm
        title="delete"
        description={`Are you sure? Unsaved changes will be lost`}
        onConfirm={handleCancel}
        okText="Yes"
        cancelText="No"
      >

        <Button key="back">
          Cancel
        </Button>
      </Popconfirm>,
      <Button key="submit" type="primary" loading={loadings} onClick={handleSubmit(submitForm)}>
        Submit
      </Button>

    ]}>

      {projectId ? <h2>Edit Home Page Feature</h2> : <h2>Add Home Page Feature</h2>}
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
          {...register('url')}
          label="URL"
          className='single-inputs'
          placeholder="URL will be /projects/*URL*"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <Controller
          name="year"
          control={control}

          render={({ field }) => (
            <Select
              placeholder="Year"
              {...field}
              style={{ width: 120 }}
              defaultValue={2025}
              options={[
                { value: 2025, label: '2025' },
                { value: 2024, label: '2024' },
                { value: 2023, label: '2023' },
                { value: 2022, label: '2022' },
                { value: 2021, label: '2021' },
                { value: 2020, label: '2020' },
              ]}
            />
          )}

        />

        <TextField
          {...register('date')}
          label="Date"
          className='single-inputs'
          placeholder="e.g. Spring 2023"
          fullWidth
          InputLabelProps={{ shrink: true }}

        />
        <TextField
          {...register('location')}
          label="Location"
          className='single-inputs'
          placeholder="Location"
          fullWidth
          InputLabelProps={{ shrink: true }}

        />
        <TextField
          {...register('summary')}
          label="Summary"
          className='single-inputs'
          placeholder="Short Summary"
          multiline  // for some reason having multiline here causes an MUI bug
          rows={2}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          {...register('longDescription')}
          label="Description"
          className='single-inputs'
          placeholder="Longer Description"
          multiline  // for some reason having multiline here causes an MUI bug
          rows={4}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <Controller
          name='format'
          control={control}

          render={({ field }) => (
            <Select
              placeholder="Format"
              {...field}
              style={{ width: 120 }}
              defaultValue={'medium'}
              options={[
                { value: 'tall', label: 'tall' },
                { value: 'square', label: 'square' },
                { value: 'medium', label: 'wide' },
                { value: 'wide', label: 'ultra-wide' },
              ]}
            />
          )}
        />

      </Space>
      <DropZone sendImage={getImageFromDrop}></DropZone>

      <>
        <Reorder.Group values={fileList} onReorder={handleReorder}>
          {fileList.map((file) => (
            <Reorder.Item key={file.uid} value={file}>
              <Upload
                // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture"
                defaultFileList={[fileList[fileList.indexOf(file)]]}
                progress={{ strokeWidth: 2, showInfo: false }}
                onRemove={handleRemove}
              >

              </Upload>
            </Reorder.Item>
          ))}

        </Reorder.Group>
        <Button type="primary" onClick={handleUpload} icon={<UploadOutlined />}>
          Upload
          <input type='file' multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}></input>
        </Button>
      </>



    </Modal>
  );
}

export default ProjectEditorModal;