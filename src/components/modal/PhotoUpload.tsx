import React, { useEffect, useRef, useState } from 'react';
import "./Modal.css";
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Image, Upload, Button } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Reorder } from 'framer-motion';
import { v4 } from 'uuid';
import { getProjectPhotos, uploadImage } from '../../firebase/firebase.tsx';

interface PhotoUploadProps {
  projectId: string;
  updated: (files: string[]) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({projectId, updated}) => {

  const [fileList, setFileList] = useState<UploadFile[]>([
    // {
    //   uid: '0',
    //   name: 'xxx.png',
    //   status: 'uploading',
    //   percent: 33,
    // },
    // {
    //   uid: '-1',
    //   name: 'yyy.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   uid: '-2',
    //   name: 'zzz.png',
    //   status: 'error',
    // },
  ]);





  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReorder = (newFileList) => {
    console.log('Reordered list:', newFileList);
    setFileList(newFileList);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event) => {
    console.log("handle file change");
    const files: File[] = Array.from(event.target.files);
    let newFileList: UploadFile[] = await Promise.all(files.map(async (file) => {
      try{
        let newUrl: string = await uploadImage(file, file.name);
        return {
          uid: v4(),
          name: file.name,
          status: 'done',
          url: newUrl,
          thumbUrl: newUrl,
        } as UploadFile;
      }
      catch(e){
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
  useEffect(() => {
    console.log(fileList);
    let urls: string[] = fileList
    .filter((file) => file.status === 'done')
    .map((file) => file.url) as string[];
    updated(urls);
  }, [fileList]);

  const handleRemove = (file: UploadFile) => {
    console.log(fileList);
    setFileList((prevFileList) => prevFileList.filter((file) => file.status !== 'removed'));
    let urls: string[] = fileList
    .filter((file) => file.status === 'done')
    .map((file) => file.url).filter(
        (url) => url !== undefined) as string[];
    updated(urls);
  };

  return (
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
        <input type='file' multiple ref={fileInputRef} style={{display: 'none'}} onChange={handleFileChange}></input>
      </Button>
    </>

  );
};

export default PhotoUpload;