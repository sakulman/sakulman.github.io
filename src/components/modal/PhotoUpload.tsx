import React, { useRef, useState } from 'react';
import "./Modal.css";
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Image, Upload, Button } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Reorder } from 'framer-motion';



const PhotoUpload: React.FC = () => {


  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '0',
      name: 'xxx.png',
      status: 'uploading',
      percent: 33,
    },
    {
      uid: '-1',
      name: 'yyy.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'zzz.png',
      status: 'error',
    },
  ]);


  return (
    <>
      <Reorder.Group axis='y' values={fileList} onReorder={setFileList}>
        {fileList.map((file) => (
          <Reorder.Item key={fileList.indexOf(file)} value={file}>
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture"
              defaultFileList={[fileList[fileList.indexOf(file)]]}
            >

            </Upload>
          </Reorder.Item>
        ))}

      </Reorder.Group>
      <Button type="primary" icon={<UploadOutlined />}>
        Upload
      </Button>
    </>

  );
};

export default PhotoUpload;