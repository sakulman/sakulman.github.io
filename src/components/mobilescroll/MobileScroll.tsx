import * as React from 'react';
import './MobileScroll.css';
import SquareTile from '../squaretile/squaretile.tsx';
import MobileSquareTile from '../squaretile/mobilesquaretile.tsx';


function MobileScroll() {

    const tiles: number[] = [2024, 2024, 2024, 2024, 2023, 2023, 2023, 2023, 2022, 2022, 2021, 2021];
    return (
        <div className='mobile-scroll'>
            {
                tiles.map((year) => (
                    <div className='mobile-square-tile'>
                        <MobileSquareTile title={year} />
                    </div>


                ))
            }
        </div>
    );

}

export default MobileScroll;