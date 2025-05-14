import { Stack } from '@mui/material';
import * as React from 'react';
import './SideBar.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { set, clear, setclicked } from '../../state/scroll/scrollSlice.ts';
import { useDispatch } from 'react-redux';

function SideBar() {

    type Hash = {
        [key: number]: number;
    };

    const view: Hash = useSelector((state: RootState) => state.scroll.value);
    const spacerview: Hash = useSelector((state: RootState) => state.scroll.spacer);

    let maxKey: number | undefined;
    let maxValue = -Infinity; // Initialize with the lowest possible number

    for (const [k, value] of Object.entries(view).map(([k, v]) => [Number(k), Number(v)])) {
        if (value > maxValue || (value === maxValue && k > (maxKey ?? -Infinity))) {
          maxValue = value;
          maxKey = k;
        }
    }
    // console.log(spacerview);



    function check (val: number): boolean{
        if (maxKey == val) {
            return true;
        }
        return false;
    }

    const dispatch = useDispatch();

    function scroll(str: string) {
        document.getElementById(`spacer-${str}`)!.scrollIntoView({ behavior: 'smooth' });
    }

    function scrollTo(to: number) {
        // console.log("clicked: " + to.toString());
        dispatch(setclicked(to));
    }


    return (

        <Stack className='side-stack' spacing={0}>
            <h2 onClick={() => scrollTo(1)} className={check(2024) ? "selected-stack-item" : "stack-item"} >2025</h2>
            <h2 onClick={() => scrollTo(2)} className={check(2024) ? "selected-stack-item" : "stack-item"} >2024</h2>
            <h2 onClick={() => scrollTo(3)} className={check(2023) ? "selected-stack-item" : "stack-item"}>2023</h2>
            <h2 onClick={() => scrollTo(4)} className={check(2022) ? "selected-stack-item" : "stack-item"}>2022</h2>
            <h2 onClick={() => scrollTo(5)} className={check(2021) ? "selected-stack-item" : "stack-item"}>2021</h2>

        </Stack>
    );
    

}

export default SideBar;