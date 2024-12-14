import { createSlice, isAction, PayloadAction } from "@reduxjs/toolkit";

type Hash = {
    [key: number]: number;
};

type Tuple = [number, number];


interface ScrollState {
    value: Hash;
    move: Tuple;
    spacer: Hash;
    recent: number;
    clicked: number;
};

const initialState: ScrollState = {
    value: {},
    move: [0, 0],
    spacer: {1: 0, 2: 0, 3: 0, 4: 0},
    recent: 1,
    clicked: 0,
};

const scrollSlice = createSlice({
    name: "scroll",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<number>) => {
            if (!state.value[action.payload]) {
                state.value[action.payload] = 1;
            } 
            else {
               state.value[action.payload] += 1; 
            }
            
        },
        subtract: (state, action: PayloadAction<number>) => {
            state.value[action.payload] -= 1;
        },
        set: (state, action: PayloadAction<Tuple>) => {
            state.move = action.payload;
        },
        clear: (state) => {
            state.move = [0, 0];
        },
        addspacer: (state, action: PayloadAction<number>) => {
            if (!state.spacer[action.payload]) {
                state.spacer[action.payload] = 1;
            } 
            else {
               state.spacer[action.payload] += 1; 
            }
            
        },
        subtractspacer: (state, action: PayloadAction<number>) => {
            state.spacer[action.payload] -= 1;
        },
        setrecent: (state, action: PayloadAction<number>) => {
            state.recent = action.payload;
        },
        setclicked: (state, action: PayloadAction<number>) => {
            state.clicked = action.payload;
        }
    }
});

export const { add, subtract, set, clear, addspacer, subtractspacer, setrecent, setclicked } = scrollSlice.actions;

export default scrollSlice.reducer;