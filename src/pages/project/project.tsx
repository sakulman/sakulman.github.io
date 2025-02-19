import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Project } from '../../types/Project.ts';
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
import "./project.css";
import ProjectOverview from '../../components/projects/project-overview.tsx';


const ProjectPage: React.FC<{ projectId: string }> = ({ projectId }) => {



    const itemData = [
        'https://images.unsplash.com/photo-1549388604-817d15aa0110',
        'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
        'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
        'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
        'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
        'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
        'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
        'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
        'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
        'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
        'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
        'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    ];

    const [current, setCurrent] = useState(0);

    const onDownload = () => {
        const url = itemData[current];
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
    };
    return (
        <Grid className="project-page-container" container style={{ display: 'flex' }} spacing={2}>
            <Grid size={5}></Grid>
            <Grid className='project-title' size={2}>
                <h1 className='project-title-text'>Project</h1>
            </Grid>
            <Grid size={5}></Grid>
            {/* <Grid size={2}></Grid> */}
            <Grid size={12}>
                <div className='project-page-main'>
                    <Tabs tabPosition={'left'} size='large'>
                        <Tabs.TabPane tab="Overview" key="1">
                            <ProjectOverview projectId={projectId} imageUrl='https://firebasestorage.googleapis.com/v0/b/portfolio-8f239.firebasestorage.app/o/images%2F9613ee64-89be-436a-bec1-4e86eb68573675_22609_00_N24_weblg-2140x1203.jpg?alt=media&token=09e0b648-e284-4453-9354-19048dd55432' />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Images" key="2">
                            <Box sx={{ width: "80%", height: 700, overflowY: 'scroll' }}>
                                <ImageList variant="masonry" cols={3} gap={20}>
                                    {itemData.map((item) => (
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
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Tab 3" key="3">
                            Content of Tab 3
                        </Tabs.TabPane>
                    </Tabs>
                </div>


            </Grid>
            {/* <Grid size={2}></Grid> */}

        </Grid>
    );
};

export default ProjectPage