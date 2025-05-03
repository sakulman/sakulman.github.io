import React, { useEffect, useRef, useState } from 'react';
import { Grid2 as Grid, IconButton } from '@mui/material';
import { firestore, getProjectForEditorTile } from '../../firebase/firebase.tsx';
import { collection, deleteDoc, doc, getDoc } from '@firebase/firestore';
import { HomeTileForm } from '../../types/HomeTileForm.ts';
import "./ReorderCard.css";
import type { PopconfirmProps } from 'antd';
import { DragControls, Reorder, useDragControls, useMotionValue } from 'motion/react';
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, message, Popconfirm } from 'antd';
import { Reorder as ReorderIcon } from '@mui/icons-material';
import Upload from '../../pages/upload/Upload.tsx';
import ProjectEditorModal from '../modal/ProjectEditorModal.tsx';
import { Project } from '../../types/Project.ts';
interface ReorderCardProps {
    id: string;
    reRender: () => void;
    deleteTile: (id: string) => void;

}

const ReorderCard = React.forwardRef<HTMLDivElement, ReorderCardProps>((props, ref) => {
    const { id, reRender, deleteTile } = props; // Extract props from 'props'
    
    interface ReorderIconProps {
        dragControls: DragControls;
    };
    const ReorderIcon: React.FC<ReorderIconProps> = ({ dragControls }) => {
        return (
            <IconButton
                onPointerDown={(e) => dragControls.start(e)}
                className="reorder-drag-icon"
            >
                <DragHandleIcon sx={{ fontSize: 40 }} />
            </IconButton>
        );
    }
    const [project, setProject] = useState<Project | null>(null);

    const HomeTilesRef = collection(firestore, "HomeTiles");
    const dragControls = useDragControls();

    useEffect(() => {
        const fetchDoc = async () => {
            const proj: Project | null = await getProjectForEditorTile(id);
            if (proj == null) {
                console.log("No such document!");
                return;
            }
            setProject(proj!);
        }
        fetchDoc();
    }, []);

    const y = useMotionValue(0);


    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDeleteTile = async () => {
        try {
            const docRef = doc(firestore, "HomeTiles", id);
            await deleteDoc(docRef);
        } catch (e) { 
            return;
        }
        deleteTile(id);
    };

    return (
        <Reorder.Item style={{ y }} dragListener={false} dragControls={dragControls} value={id} id={id}>
            <Grid className='reorder-card' container spacing={0}>
                <Grid size={1}></Grid>
                <Grid size={2}>
                    <div >
                        <img className='reorder-card-image' src={project?.displayImage}></img>
                    </div>
                </Grid>
                <Grid className='reorder-card-text' size={3}>
                    <h2>{project?.title}</h2>

                </Grid>
                <Grid size={2}>

                </Grid>
                <Grid className='reorder-edit-icon' onClick={showModal} size={1}>
                    <EditOutlined />
                </Grid>
                <Divider type="vertical" className='reorder-divider' />
                <Popconfirm
                    title="Delete"
                    description={`Are you sure you want to delete ${project?.title}?`}
                    onConfirm={handleDeleteTile}
                    okText="Yes"
                    cancelText="No"
                >
                    <Grid className='reorder-edit-icon reorder-delete' size={1}>
                    <DeleteOutlined />
                </Grid>
                </Popconfirm>
                

                <Grid className='reorder-drag' size={1}>

                    <ReorderIcon dragControls={dragControls} />


                </Grid>

            </Grid>
            <ProjectEditorModal
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
                handleOk={handleOk}
                projectId={id}
                reRender={() => { }}
            >

            </ProjectEditorModal>

        </Reorder.Item>
    );
});

export default ReorderCard;