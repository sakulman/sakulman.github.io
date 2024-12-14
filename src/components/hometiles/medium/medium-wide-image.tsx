import * as React from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import "./medium-wide-image.css"
import { HomeTileForm } from '../../../types/HomeTileForm.ts';

interface MediumWideImageProps {
    data: HomeTileForm;
};

function MediumWideImage(form: MediumWideImageProps) {

    return (
        <Grid className='home-row' container spacing={2}>
            <Grid size={1.5}></Grid>
            
            <Grid  size={2}>
                <Box className='medium-descriptor-text'>
                    <Box className='text-title'>
                        <h1 className='clickable-title'>
                            {form.data.title}
                        </h1> 
                        <p className='clickable-title'>{form.data.year}</p>
                </Box>
                <Box className='medium-text-desc'>
                        <p>{form.data.description}</p>
                </Box>
                </Box>
                
                
            </Grid>
            <Grid className='image-tile' size={7}>
                <img className='medium-image' src={form.data.imageUrl} />
            </Grid>
            <Grid size={1.5}></Grid>
        </Grid>

    );


}

export default MediumWideImage;