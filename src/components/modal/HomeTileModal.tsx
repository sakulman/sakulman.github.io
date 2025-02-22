import * as React from 'react';
import './Modal.css';
import { Input as AntInput, Space, Select, Button, Modal, message, Popconfirm, Form } from 'antd';
import { useState, useRef, useEffect } from 'react';
import DropZone from '../../pages/upload/dropzone/DropZone.tsx';
import { HomeTileForm } from '../../types/HomeTileForm.ts';
import { firestore, storage, uploadImage, writeProjectPhotos } from "../../firebase/firebase.tsx";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "@firebase/firestore";
import { v4 } from "uuid";
import { HomeTileType } from '../../enums/HomeTileType.ts';
import { TextField } from '@mui/material';
import PhotoUpload from './PhotoUpload.tsx';
import ProjectPhotos from './ProjectPhotos.tsx';
import { Tabs } from 'antd';
import HomeTileTab from './HomeTileTab.tsx';


type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface ModalComponentProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  tileId: string | null;
  reRender: () => void;
}

const { TextArea } = AntInput;
interface Positions {
  [key: number]: string;
}

const HomeTileModal: React.FC<ModalComponentProps> = ({ isModalOpen, handleCancel, handleOk, tileId, reRender }: ModalComponentProps) => {


  const initialItems = [
    { label: 'Tab 1', children: <HomeTileTab tileId={tileId} isModalOpen={isModalOpen} />, key: '1' },
    { label: 'Tab 2', children: 'Content of Tab 2', key: '2' },
    {
      label: 'Tab 3',
      children: 'Content of Tab 3',
      key: '3',
      closable: false,
    },
  ];

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({ label: 'New Tab', children: 'Content of new Tab', key: newActiveKey });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const positionData = useRef<Positions[]>([]);
  const projectImages = useRef<string[]>([]);



  const [loadings, setLoadings] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (errorMessage) {
      message.error(errorMessage);
      setErrorMessage(null); // Reset the error message after displaying it
    }
  }, [errorMessage]);



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

          setFormState(HomeTileForm.fromJson(docSnap.data()));
          HomeTileFormRef = HomeTileForm.fromJson(formState);

        }
      }
      return;
    }

    fetchData();

  }, [isModalOpen]);


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

    setLoadings(true);
    if (formState == null) {
      setLoadings(false);
      setErrorMessage("Form state is null");
      return;
    }
    if (formState.title == "" || formState.title == null) {
      setTitleInputStatus(true);
      setErrorMessage("Title field is empty");
    }
    if (formState.year == "" || formState.year == null) {
      setYearInputStatus(true);
      setErrorMessage("Year field is empty");
    }
    if (formState.description == "" || formState.description == null) {
      setDescriptionInputStatus(true);
      setErrorMessage("Description field is empty");
    }
    if (formState.title == "" || formState.title == null || formState.year == "" || formState.year == null || formState.description == "" || formState.description == null) {
      setLoadings(false);
      return;
    }
    if (tileId != null) {
      console.log(formState.description)
      try {
        const docRef = doc(firestore, "HomeTiles", tileId);
        if (changedTitle) {
          await updateDoc(docRef, { title: formState.title });
        }
        if (changedYear) {
          await updateDoc(docRef, { year: formState.year });
        }
        if (changedDescription) {
          await updateDoc(docRef, { description: formState.description });
        }
        await writeProjectPhotos(tileId, projectImages.current);
        if (changedImageUrl) {
          if (formState.image == null) {
            setErrorMessage("No image selected");
            setLoadings(false);
            return;
          }
        }

      }
      catch (e) {
        console.log("error updating document: " + e);
      };
      setChangedTitle(false);
      setChangedYear(false);
      setChangedDescription(false);
      setChangedImageUrl(false);
      setLoadings(false);
      handleOk();
      reRender();

    }
    else {
      if (formState.image == null) {
        setLoadings(false);
        setErrorMessage("No image selected");
        return;
      }
      console.log("here2");

      const imageRef = ref(storage, `images/${v4() + formState.image.name}`);
      const snapshot = await uploadBytes(imageRef, formState.image);
      const url = await uploadImage(formState.image, formState.image.name);
      // for google cloud
      // let newUrl: string | null = await uploadImage(formState.image, HomeTileFormRef);
      //   if (newUrl == null) {
      //       console.log("url is null");
      //       return;
      //   }
      formState.imageUrl = url;

      try {
        formState.position = await getNewPosition();
        console.log(formState.description);
        const created = await addDoc(HomeTilesRef, JSON.parse(JSON.stringify(formState)));
      } catch (e) {
        setLoadings(false);
        console.log("error adding document: " + e);
        return;
      };
      setLoadings(false);
      handleOk();
      reRender();

    }

    // setFormState({ ...HomeTileFormRef });

  };
  // const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
  //   const { value } = e.target;
  //   setFormState(prevState => ({ ...prevState, [field]: value }));
  // };

  // const handleSelectChange = (value: string) => {
  //   setFormState(prevState => ({ ...prevState, format: value as HomeTileType }));
  // };

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


  const handleProjectPhotos = (photos: string[]) => {
    // console.log(projectImages.current);
    projectImages.current = [...photos];
    console.log(projectImages.current);
    // console.log(projectImages.current); 
  };

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
      <Button key="submit" type="primary" loading={loadings} onClick={submitForm}>
        Submit
      </Button>

    ]}>

      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
      />
      {/* <div>
        {tileId ? <h2>Edit Home Page Feature</h2> : <h2>Add Home Page Feature</h2>}

        <Space className='input-container' direction='vertical' size={10}>

          <TextField
            label="Title"
            error={titleInputStatus}
            value={formState.title}
            onChange={(e) => handleFormChange(e, "title")}
            className='single-inputs'
            placeholder="Title"
            fullWidth
          />
          <TextField
            label="Year"
            error={yearInputStatus}
            value={formState.year}
            onChange={(e) => handleFormChange(e, "year")}
            className='single-inputs'
            placeholder="Year"
            fullWidth
          />
          <TextField
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
        <PhotoUpload projectId={tileId!} updated={handleProjectPhotos}></PhotoUpload>
        <ProjectPhotos projectId={tileId!} updated={handleProjectPhotos}></ProjectPhotos>
      </div> */}
    </Modal>
  );
}

export default HomeTileModal;