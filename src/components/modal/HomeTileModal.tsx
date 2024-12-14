import * as React from 'react';
import './Modal.css';
import { Input as AntInput, Space, Select, Button, Modal, message, Popconfirm } from 'antd';
import { useState, useRef, useEffect } from 'react';
import DropZone from '../../pages/upload/dropzone/DropZone.tsx';
import { HomeTileForm } from '../../types/HomeTileForm.ts';
import { firestore, storage } from "../../firebase/firebase.tsx";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "@firebase/firestore";
import { v4 } from "uuid";
import { HomeTileType } from '../../enums/HomeTileType.ts';

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

  const positionData = useRef<Positions[]>([]);

  

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
      console.log(changedDescription)
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
        if (changedImageUrl) {
          if (formState.image == null) {
            setErrorMessage("No image selected");
            setLoadings(false);
            return;
          }
          const newName: string = v4() + formState.image.name;
          const imageRef = ref(storage, `images/${newName}`);
          const snapshot = await uploadBytes(imageRef, formState.image);
          const url = await getDownloadURL(snapshot.ref);
          formState.imageUrl = url;
          await updateDoc(docRef, { imageUrl: formState.imageUrl });
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
      const newName: string = v4() + formState.image.name;
      const imageRef = ref(storage, `images/${newName}`);
      const snapshot = await uploadBytes(imageRef, formState.image);
      const url = await getDownloadURL(snapshot.ref);
      formState.imageUrl = url;

      try {
        formState.position = await getNewPosition();
        console.log(formState);
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
      <div>
        {tileId ? <h2>Edit Home Page Feature</h2> : <h2>Add Home Page Feature</h2>}

        <Space className='input-container' direction='vertical' size={10}>
          <AntInput {... (titleInputStatus ? { status: "error" } : {})} value={formState.title} onChange={(e) => handleFormChange(e, "title")} className='single-inputs' placeholder="Title" />

          <AntInput {... (yearInputStatus ? { status: "error" } : {})} value={formState.year} onChange={(e) => handleFormChange(e, "year")} className='single-inputs' placeholder="Year" />

          <TextArea {... (descriptionInputStatus ? { status: "error" } : {})} value={formState.description} onChange={(e) => handleFormChange(e, "description")} placeholder='Short Description'></TextArea>
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
      </div>
    </Modal>
  );
}

export default HomeTileModal;