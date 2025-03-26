import * as React from 'react';
import { Grid2 as Grid } from '@mui/material';
import "./Editor.css";
import { getProjectOrder, storage, writeProjectOrder } from "../../firebase/firebase.tsx";
import { useState} from 'react';
import { Reorder, useDragControls } from "motion/react";
import { PlusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Flex, Switch } from 'antd';
import ReorderCard from '../../components/reordercard/ReorderCard.tsx';
import ProjectEditorModal from '../../components/modal/ProjectEditorModal.tsx';


function Editor() {

    const [triggerRender, setTriggerRender] = useState(0);

   

    const [tileList, setTileList] = useState<string[]>([]);  


    React.useEffect(() => {
        const fetchData = async () => {
            const tiles: string[] = await getProjectOrder();
            setTileList(tiles);
        };
        fetchData();
    }, [triggerRender]);

    const submitOrder = async () => {
        await writeProjectOrder(tileList);
        
    };

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

    const triggerReRender = () => {
        console.log("triggering re-render");
        setTriggerRender(prev => prev + 1);
    };

    const deleteTile = (id: string) => {
        let copy = [...tileList];
        const index = copy.indexOf(id);
        copy.splice(index, 1);
        setTileList(copy);
    };


    return (
        <Grid className="editor-page" container spacing={2}>
            <Grid size={3}></Grid>

            <Grid size={6} className="editor-main-grid">
                <div className='reorder-area'>
                    <Reorder.Group className="reorder-group" values={tileList} onReorder={submitOrder}>
                        {tileList.map((tileId) => {
                            return (

                                <ReorderCard deleteTile={deleteTile} reRender={triggerReRender} key={tileId} id={tileId}></ReorderCard>
                            );
                        })}
                    </Reorder.Group>
                    <div className='add-new-reorder' onClick={showModal}>
                        <PlusCircleOutlined />

                    </div>
                    <ProjectEditorModal
                        isModalOpen={isModalOpen}
                        handleCancel={handleCancel}
                        handleOk={handleOk}
                        projectId={null}
                        reRender={triggerReRender}
                    >

                    </ProjectEditorModal>
                </div>
                <div className='save-tile-order'>
                    <Button color='default' className='save-tile-order-button' onClick={submitOrder} >Save Tile Order</Button>

                </div>

            </Grid>
            <Grid size={3}></Grid>
        </Grid>
    );
}

export default Editor;