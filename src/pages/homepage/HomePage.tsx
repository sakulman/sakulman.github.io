import { Box, Grid2 as Grid } from '@mui/material';
import * as React from 'react';
import "./HomePage.css"
import MediumWideImage from '../../components/hometiles/medium/medium-wide-image.tsx';
import UltraWideImage from '../../components/hometiles/wide/ultra-wide-image.tsx';
import SquareImage from '../../components/hometiles/square/square-image.tsx';
import Footer from '../../components/footer/footer.tsx';
import { useEffect, useState } from 'react';
import MobileTile from '../../components/hometiles/mobile/mobile-tile.tsx';
import { firestore, storage } from "../../firebase/firebase.tsx";
import { collection, getDocs } from 'firebase/firestore';
import { HomeTileType } from '../../enums/HomeTileType.ts';
import { HomeTileForm } from '../../types/HomeTileForm.ts';

function HomePage() {

    const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 1000px)').matches);
    const [tiles, setTiles] = useState<HomeTileForm[]>([]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1000px)');
        const handleMediaChange = (e) => {
            setIsMobile(e.matches);
        };

        // Add the event listener for changes
        mediaQuery.addEventListener('change', handleMediaChange);

        // Clean up event listener on component unmount
        return () => mediaQuery.removeEventListener('change', handleMediaChange);

    }, []);

    useEffect(() => {
        const fetchTiles = async () => {
            const querySnapshot = await getDocs(collection(firestore, "HomeTiles"));
            const tilesData = querySnapshot.docs.map(doc => HomeTileForm.fromJson(doc.data()));
            setTiles(tilesData);
        };

        fetchTiles();
    }, []);

    return (


        <Box className='body'>

            {
                !isMobile && (
                    <div>
                        {tiles.map(tile => {
                            console.log(tile.imageUrl);
                            return (
                                <div key={tile.title}>
                                    {tile.format === HomeTileType.Medium && <MediumWideImage data={tile} />}
                                    {tile.format === HomeTileType.Wide && <UltraWideImage data={tile} />}
                                    {tile.format === HomeTileType.Square && <SquareImage data={tile} />}
                                    <Box className='home-spacer'></Box>
                                </div>
                                
                            );
                        })}
                        
                    </div>
                )
            }

            {/* {
                isMobile && (
                    <div>
                        <MobileTile />
                        <Box className='mobile-home-spacer'></Box>
                        <MobileTile />
                        <Box className='mobile-home-spacer'></Box>
                        <MobileTile />
                        <Box className='mobile-home-spacer'></Box>
                    </div>

                )
            } */}


            <Footer></Footer>
        </Box>

    );

}



export default HomePage;