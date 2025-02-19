import * as React from 'react';
import { motion, useTransform, useScroll } from "framer-motion";
import { Box } from '@mui/material';
import SquareTile from '../squaretile/squaretile.tsx';
import './horizontalscroll.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store.ts';
import SquareTileSpacer from '../squaretile/squaretilespacer.tsx';
import { click } from '@testing-library/user-event/dist/click';
import { setclicked } from '../../state/scroll/scrollSlice.ts';

function HorizontalScroll() {

    type Hash = {
        [key: number]: number;
    };

    const targetRef = React.useRef(null);
    const { scrollYProgress } = useScroll({
      target: targetRef,
    });

    const dispatch = useDispatch();
  
    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-87%"]);


    const tiles: number[] = [1, 2024, 2024, 2024, 2024, 2, 2023, 2023, 2023, 2023, 3, 2022, 2022, 4, 2021, 2021];


    const spacerview: Hash = useSelector((state: RootState) => state.scroll.spacer);
    const recent: number = useSelector((state: RootState) => state.scroll.recent);
    const clicked: number = useSelector((state: RootState) => state.scroll.clicked);

    if (clicked > 0) {
        
        startScroll(clicked);
        dispatch(setclicked(0));
    }


    function move(direction: number) {
            window.scrollBy(0, direction);
        
    };
    const spacerviewRef = React.useRef(spacerview);
    React.useEffect(() => {
        spacerviewRef.current = spacerview;
    }, [spacerview]);


    // scroll until the desired spacer comes into view
    function startScroll(destination: number) {
        // most recently displayed spacer
        let current: number = recent;
        // if the spacer is currently on the screen
        let isInView: boolean = spacerview[current] === 1;
        
        // case 1: current < destination, isInView doesn't matter
        if (current < destination) {
            // scroll right until the destination spacer first appears
            const scrollInterval1 = setInterval(() => {
                if (spacerviewRef.current[destination] !== 1) {
                    window.scrollBy(0, 10); 
                }
                if (spacerviewRef.current[destination] === 1) {
                    clearInterval(scrollInterval1);
                    // scroll right until the destination spacer disappears
                    const scrollInterval2 = setInterval(() => {
                        if (spacerviewRef.current[destination] !== 0) {
                            window.scrollBy(0, 10);
                        }
                        
                        if (spacerviewRef.current[destination] === 0) {
                            clearInterval(scrollInterval2);
                        }
                    }, 1);
                }
            }, 1);
            return;
        }
        // case 2: current > destination, isInView matters
        else if (current > destination) {
            // scroll left until the destination spacer first appears
            const scrollInterval1 = setInterval(() => {
                if (spacerviewRef.current[destination] !== 1) {
                    window.scrollBy(0, -10);
                }
                
                if (spacerviewRef.current[destination] === 1) {
                    clearInterval(scrollInterval1);

                }
            }, 1);
            return;
        }

        else if (current == destination) {
            if (spacerview[current] == 1) {
                const scrollInterval1 = setInterval(() => {
                if (spacerviewRef.current[destination] != 0) {
                    window.scrollBy(0, 5);
                }
                
                if (spacerviewRef.current[destination] == 0) {
                    clearInterval(scrollInterval1);
                }
            }, 1);
            return;
            }
            else {
                const scrollInterval1 = setInterval(() => {
                    if (spacerviewRef.current[destination] == 0) {
                        window.scrollBy(0, -5);
                    }
                    
                    if (spacerviewRef.current[destination] != 0) {
                        clearInterval(scrollInterval1);
                    }
                }, 1);
                return;
            }
            
        }
    }
    


    return (
        <section ref={targetRef} className="section">
            <div className="container">
                <motion.div style={{ x }} className="motion-div">
                    {
                        tiles.map((year) => (
                            year < 2000 ? <SquareTileSpacer id={year} /> : <SquareTile title={year} />
                        ))
                    }
                </motion.div>
            </div>
        </section>

    );

}

export default HorizontalScroll;