import React, { useEffect, useRef, useState } from 'react';
import { Grid2 as Grid, IconButton } from '@mui/material';
import { firestore } from '../../firebase/firebase.tsx';
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
import HomeTileModal from '../modal/HomeTileModal.tsx';
interface ReorderCardProps {
    id: string;
    reRender: () => void;
    deleteTile: (id: string) => void;

}

const ReorderCard = React.forwardRef<HTMLDivElement, ReorderCardProps>(({ id, reRender, deleteTile }: ReorderCardProps) => {


    
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
    const [homeTile, setHomeTile] = useState<HomeTileForm | null>(null);

    const HomeTilesRef = collection(firestore, "HomeTiles");
    const dragControls = useDragControls();

    useEffect(() => {
        const fetchDoc = async () => {
            const docRef = doc(firestore, "HomeTiles", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setHomeTile(HomeTileForm.fromJson(docSnap.data()));
                return;
            }
            console.log("No such document!");
            return;
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
                        <img className='reorder-card-image' src={homeTile?.imageUrl}></img>
                    </div>
                </Grid>
                <Grid className='reorder-card-text' size={3}>
                    <h2>{homeTile?.title}</h2>

                </Grid>
                <Grid size={2}>

                </Grid>
                <Grid className='reorder-edit-icon' onClick={showModal} size={1}>
                    <EditOutlined />
                </Grid>
                <Divider type="vertical" className='reorder-divider' />
                <Popconfirm
                    title="Delete"
                    description={`Are you sure you want to delete ${homeTile?.title}?`}
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
            <HomeTileModal
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
                handleOk={handleOk}
                tileId={id}
                reRender={() => { }}
            >

            </HomeTileModal>

        </Reorder.Item>
    );
});

export default ReorderCard;