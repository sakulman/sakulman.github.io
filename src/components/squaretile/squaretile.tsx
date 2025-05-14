import * as React from 'react';
import './squaretile.css';
import { motion } from 'framer-motion';
import { add, subtract } from '../../state/scroll/scrollSlice.ts';
import { useDispatch } from 'react-redux';
import { Grid2 as Grid } from '@mui/material';
import { SelectedWorksOrder } from '../../types/SelectedWorksOrder.ts';

interface TileProps{
    projectInfo: SelectedWorksOrder;
}

function SquareTile({ projectInfo }: TileProps) {

    const TextLayout = () => {
        return (
            <div className='card-text'>
                <Grid container spacing={2} >
                    <Grid size={12}>{projectInfo[1]}</Grid>
                </Grid>
            </div>
            
        ); 
    };

    const dispatch = useDispatch();

    const inView = () => {
        dispatch(add(projectInfo[0]));
        console.log("+"+projectInfo[0]);
    };

    const outView = () => {
        dispatch(subtract(projectInfo[0]));
        console.log("-"+projectInfo[0]);
    };

    return (
        <motion.div onViewportEnter={() => inView()} onViewportLeave={() => outView()}>
            <div className="card">
                <div className="card-image">
                    <img className='square-image' src={projectInfo[2]}></img>
                </div>
                <TextLayout></TextLayout>
            </div>
        </motion.div>

        

    );

}

export default SquareTile;