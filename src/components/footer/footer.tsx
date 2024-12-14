import { Box, Grid2 as Grid } from '@mui/material';
import * as React from 'react';
import './footer.css'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Instagram, Mail } from '@mui/icons-material';

function Footer() {
    

    return (

        <Box className='footer'>

            <div className='spacer'></div>

            <Grid className='footer-grid' container spacing={2}>

                <Grid size={3}></Grid>

                <Grid size={6}>
                    <div className='social-icons'>
                        <div className='icon-circle'>
                            <LinkedInIcon  />
                        </div>
                        <div className='icon-circle'>
                            <Instagram  />
                        </div>
                        <div className='icon-circle'>
                            <Mail  />
                        </div>
                        
                    </div>
                </Grid>

                <Grid size={3}></Grid>
                
            </Grid>

        </Box>
    );
}

export default Footer;