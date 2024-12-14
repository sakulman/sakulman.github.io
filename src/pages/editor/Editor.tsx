import * as React from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import "./Editor.css";
import { firestore, storage } from "../../firebase/firebase.tsx";
import { addDoc, collection, doc, getDocs, updateDoc } from "@firebase/firestore";
import { useState, useCallback, useRef } from 'react';
import { HomeTileForm } from '../../types/HomeTileForm.ts';
import { Reorder, useDragControls } from "motion/react";
import { EditOutlined, EllipsisOutlined, PlusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Flex, Switch } from 'antd';
import ReorderCard from '../../components/reordercard/ReorderCard.tsx';
import HomeTileModal from '../../components/modal/HomeTileModal.tsx';

interface PositionsMap {
    [key: number]: string;
}

function Editor() {

    const [triggerRender, setTriggerRender] = useState(0);

    const positions = useRef<PositionsMap>({});

    const [tilesInOrder, setTilesInOrder] = useState<string[]>([]);

    const getPositions = async () => {
        const querySnapshot = await getDocs(collection(firestore, "HomeTiles"));
        querySnapshot.docs.forEach(doc => {
            const data = doc.data();
            positions.current[data.position] = doc.id;
        });
    }

    const setUpList = async () => {
        const keys: number[] = Object.keys(positions.current).map(key => parseInt(key));
        keys.sort((a, b) => a - b);
        const tilesList: string[] = [];
        for (let i = 0; i < keys.length; i++) {
            tilesList.push(positions.current[keys[i]]);
        }
        setTilesInOrder(tilesList);
    }

    React.useEffect(() => {
        const fetchData = async () => {
            await getPositions();
            console.log(positions.current);
            await setUpList();
            console.log(tilesInOrder);
        };
        console.log("re rendering from use effect")
        fetchData();
    }, [triggerRender]);

    const submitOrder = async () => {

        for (let i = 0; i < tilesInOrder.length; i++) {
            const docRef = doc(firestore, "HomeTiles", tilesInOrder[i]);
            await updateDoc(docRef, { position: i + 1 });
        }
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
        let copy = [...tilesInOrder];
        const index = copy.indexOf(id);
        copy.splice(index, 1);
        setTilesInOrder(copy);
    };


    return (
        <Grid className="editor-page" container spacing={2}>
            <Grid size={3}></Grid>

            <Grid size={6} className="editor-main-grid">
                <div className='reorder-area'>
                    <Reorder.Group className="reorder-group" values={tilesInOrder} onReorder={setTilesInOrder}>
                        {tilesInOrder.map((tileId) => {
                            return (

                                <ReorderCard deleteTile={deleteTile} reRender={triggerReRender} key={tileId} id={tileId}></ReorderCard>
                            );
                        })}
                    </Reorder.Group>
                    <div className='add-new-reorder' onClick={showModal}>
                        <PlusCircleOutlined />

                    </div>
                    <HomeTileModal
                        isModalOpen={isModalOpen}
                        handleCancel={handleCancel}
                        handleOk={handleOk}
                        tileId={null}
                        reRender={triggerReRender}
                    >

                    </HomeTileModal>
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