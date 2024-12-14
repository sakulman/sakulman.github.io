import * as React from 'react';
import './squaretile.css';
import { motion } from 'framer-motion';
import { add, subtract } from '../../state/scroll/scrollSlice.ts';
import { useDispatch } from 'react-redux';
import { Grid2 as Grid } from '@mui/material';

interface TileProps{
    title: number;
}

function SquareTile({ title }: TileProps) {

    const TextLayout = () => {
        return (
            <div className='card-text'>
                <Grid container spacing={2} >
                    <Grid size={12}>{title}</Grid>
                </Grid>
            </div>
            
        ); 
    };

    const dispatch = useDispatch();

    const inView = () => {
        dispatch(add(title));
        console.log("+"+title);
    };

    const outView = () => {
        dispatch(subtract(title));
        console.log("-"+title);
    };

    return (
        <motion.div onViewportEnter={() => inView()} onViewportLeave={() => outView()}>
            <div className="card">
                <div className="card-image">
                    <img className='square-image' src='https://4kwallpapers.com/images/wallpapers/modern-architecture-look-up-reflection-glass-building-2048x2048-2881.jpg'></img>
                </div>
                <TextLayout></TextLayout>
            </div>
        </motion.div>

        

    );

}

export default SquareTile;