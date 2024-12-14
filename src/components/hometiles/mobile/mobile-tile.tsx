import * as React from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import "./mobile-tile.css"
import { HomeTileForm } from '../../../types/HomeTileForm.ts';

function MobileTile(data: HomeTileForm) {

    return (
        <Grid className='home-row' container spacing={0}>
            <Grid size={1}></Grid>
            <Grid className='image-tile' size={10}>
                <img className='image' src={data.imageUrl} />
            </Grid>
            <Grid size={1}></Grid>
            <Grid size={1}></Grid>
            <Grid className='descriptor-text' size={11}>
                <Box className='text-title'>
                    <h1 className='clickable-title'>{data.title}</h1>
                    <em>{data.year}</em>
                </Box>


            </Grid>
            <Grid size={1}></Grid>
            <Grid size={10}>

                <p className='mobile-text-desc'>{data.description}</p>

            </Grid>
            <Grid size={1}></Grid>
        </Grid>

    );


}

export default MobileTile;