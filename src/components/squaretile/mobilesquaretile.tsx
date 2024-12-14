import * as React from 'react';
import './squaretile.css';

import { Grid2 as Grid } from '@mui/material';

interface TileProps{
    title: number;
}

function MobileSquareTile({ title }: TileProps) {

    const TextLayout = () => {
        return (
            <div className='card-text'>
                <Grid container spacing={2} >
                    <Grid size={12}>{title}</Grid>
                </Grid>
            </div>
            
        ); 
    };


    return (
       
            <div className="card">
                <div className="card-image">
                    <img className='square-image' src='https://4kwallpapers.com/images/wallpapers/modern-architecture-look-up-reflection-glass-building-2048x2048-2881.jpg'></img>
                </div>
                <TextLayout></TextLayout>
            </div>

        

    );

}

export default MobileSquareTile;