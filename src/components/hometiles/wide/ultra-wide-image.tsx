import * as React from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import "./ultra-wide-image.css"
import { HomeTileForm } from '../../../types/HomeTileForm.ts';

interface UltraWideImageProps {
    data: HomeTileForm;
};

function UltraWideImage(form: UltraWideImageProps) {

    return (
        <Grid className='home-row' container spacing={2}>
            <Grid size={1}></Grid>
            <Grid className='image-tile' size={10}>
                <img className='image' src={form.data.imageUrl} />
            </Grid>
            <Grid size={1}></Grid>
            <Grid size={3}></Grid>
            <Grid className='descriptor-text' size={6}>
                <Box className='text-title'>
                    <h1 className='clickable-title'>{form.data.title}</h1> 
                    <p>{form.data.year}</p>
                </Box>
                <Box className='text-desc'>
                    <p>{form.data.description}</p>
                </Box>
                
            </Grid>
            <Grid size={3}></Grid>
        </Grid>

    );


}

export default UltraWideImage;