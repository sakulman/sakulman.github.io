import React, { useEffect, useState } from 'react';
import { Box, Grid2 as Grid, ImageList, ImageListItem } from '@mui/material';
import { Tabs, Image, Space } from 'antd';
import {
    DownloadOutlined,
    LeftOutlined,
    RightOutlined,
    RotateLeftOutlined,
    RotateRightOutlined,
    SwapOutlined,
    UndoOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
} from '@ant-design/icons';
import { getProjectPhotos } from '../../firebase/firebase.tsx';
import { v4 } from 'uuid';

const ProjectImages: React.FC<{ projectId: string }> = ({ projectId }) => {

    const [projectPhotos, setProjectPhotos] = useState<string[]>([]);

    useEffect(() => {
        const fetchProjectPhotos = async () => {
            let urls: string[] = await getProjectPhotos("UbRx0qvlRmO1ar2JLVP1");
            let newFileList = urls.map((url) => {
                return {
                    uid: v4(),
                    name: url,
                    status: 'done',
                    url: url,
                    thumbUrl: url,
                }
            });
            setProjectPhotos(urls);
        };
        fetchProjectPhotos();
    }, []);

    const [current, setCurrent] = useState(0);

    const onDownload = () => {
        const url = projectPhotos[current];
        const suffix = url.slice(url.lastIndexOf('.'));
        const filename = Date.now() + suffix;

        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const blobUrl = URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(blobUrl);
                link.remove();
            });
    }

    return (
        <Box sx={{ width: "80%", height: 700, overflowY: 'scroll' }}>
            <ImageList variant="masonry" cols={3} gap={20}>
                {projectPhotos.map((item) => (
                    <ImageListItem key={item}>
                        <Image.PreviewGroup
                            preview={{
                                toolbarRender: (
                                    _,
                                    {
                                        transform: { scale },
                                        actions: {
                                            onActive,
                                            onFlipY,
                                            onFlipX,
                                            onRotateLeft,
                                            onRotateRight,
                                            onZoomOut,
                                            onZoomIn,
                                            onReset,
                                        },
                                    },
                                ) => (
                                    <Space size={20} className="toolbar-wrapper">
                                        <LeftOutlined onClick={() => onActive?.(-1)} />
                                        <RightOutlined onClick={() => onActive?.(1)} />
                                        <DownloadOutlined onClick={onDownload} />
                                        <SwapOutlined rotate={90} onClick={onFlipY} />
                                        <SwapOutlined onClick={onFlipX} />
                                        <RotateLeftOutlined onClick={onRotateLeft} />
                                        <RotateRightOutlined onClick={onRotateRight} />
                                        <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                                        <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                                        <UndoOutlined onClick={onReset} />
                                    </Space>
                                ),
                                onChange: (index) => {
                                    setCurrent(index);
                                },
                            }}
                        >

                            <Image key={item} src={item} />

                        </Image.PreviewGroup>
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
}

export default ProjectImages;