import * as React from 'react';
import './squaretile.css';
import { motion } from 'framer-motion';
import { addspacer, subtractspacer, setrecent } from '../../state/scroll/scrollSlice.ts';
import { useDispatch } from 'react-redux';

interface SpacerProp{
    id: number;
}


function SquareTileSpacer({ id }: SpacerProp) {

    const dispatch = useDispatch();

    const inView = () => {
        dispatch(addspacer(id));
        dispatch(setrecent(id));
        console.log("+"+id);
    };

    const outView = () => {
        dispatch(subtractspacer(id));
        console.log("-"+id);
    };

    return (
        <motion.div
        onViewportEnter={() => inView()} onViewportLeave={() => outView()}
            className='tile-spacer' id={`spacer-${id.toString()}`}>

        </motion.div>
    );

};


export default SquareTileSpacer;