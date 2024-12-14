import { Box, Grid2 as Grid } from '@mui/material';
import * as React from 'react';
import './SelectedWorks.css';
import { motion, useTransform, useScroll } from "framer-motion";
import Divider from '@mui/material/Divider';
import SideBar from '../../components/sidebar/SideBar.tsx';
import SquareTile from '../../components/squaretile/squaretile.tsx';
import HorizontalScroll from '../../components/horizontalscroll/horizontalscroll.tsx';
import { useEffect, useState } from 'react';
import MobileScroll from '../../components/mobilescroll/MobileScroll.tsx';


function SelectedWorks() {

    const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 1100px)').matches);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1100px)');
        const handleMediaChange = (e) => {
            setIsMobile(e.matches);
        };

        // Add the event listener for changes
        mediaQuery.addEventListener('change', handleMediaChange);

        // Clean up event listener on component unmount
        return () => mediaQuery.removeEventListener('change', handleMediaChange);

    }, []);

    return (
        <div>


            {
                !isMobile && (
                    <Box className='selected-works-body'>
                        <Grid container spacing={0}>
                            <Grid size={1.2}>
                                <SideBar />
                            </Grid>
                            <Grid size={10.8}>
                                <Box className='inner-container'>

                                    <Box className='horizontal-scroll'>

                                        <HorizontalScroll></HorizontalScroll>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )
            }


            {
                isMobile && (
                    <MobileScroll />
                )
            }
        </div>

    );
}

export default SelectedWorks;