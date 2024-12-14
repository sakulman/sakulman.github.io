import React, { useCallback, useEffect, useRef, useState } from 'react';
import './DropZone.css';
import { useDropzone } from 'react-dropzone';
import { CloseCircleOutlined, UploadOutlined } from '@ant-design/icons';

interface DropZoneProps {
    sendImage: (data: File) => void;
}

function DropZone<DropZoneProps>({ sendImage }) {

    interface SelectedImageFile extends File {
        preview: string;
    }

    const [selectedImages, setSelectedImages] = useState<SelectedImageFile[]>([]);

    const onDrop = useCallback(acceptedFiles => {
        setSelectedImages(acceptedFiles.map(file =>
            Object.assign(file,
                {
                    preview: URL.createObjectURL(file)
                    
                })
        ));
        sendImage(acceptedFiles[0]);
        
    }, [])


    const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 1, accept: { 'image/*': [] } })
    const selected_images = selectedImages?.map(file => (
        <div className='image-area'>
            <img className='selected-image' src={file.preview}></img>
            <CloseCircleOutlined className='cancel-image' onClick={() => setSelectedImages([])} />
        </div>
    ))

    return (
        <div>

            {selectedImages.length > 0 ? selected_images :
                <div {...getRootProps()}>
                    <input {...getInputProps()} />

                    <p className='pick-image'>Pick an Image <UploadOutlined /></p>

                </div>

            }
        </div>

    );

}

export default DropZone;