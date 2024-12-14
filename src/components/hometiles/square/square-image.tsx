import * as React from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import "./square-image.css"
import { HomeTileForm } from '../../../types/HomeTileForm.ts';

interface SquareImageProps {
    data: HomeTileForm;
}

function SquareImage(form: SquareImageProps) {

    return (
        <Grid className='home-row' container spacing={4}>
            <Grid size={1}></Grid>
            
            
            <Grid className='image-tile' size={7}>
                <img className='medium-image' src={form.data.imageUrl} />
            </Grid>
            <Grid  size={2}>
                <Box className='square-descriptor-text'>
                    <Box className='text-title'>
                        <h1 className='clickable-title'>
                            {form.data.title}
                        </h1> 
                        <p className='clickable-title'>{form.data.year}</p>
                </Box>
                <Box className='square-text-desc'>
                        <p>{form.data.description}</p>
                </Box>
                </Box>
                
                
            </Grid>
            <Grid size={2}></Grid>
        </Grid>

    );


}

export default SquareImage;