import { createSlice} from "@reduxjs/toolkit";

interface drawerState{
    isOpen: boolean;
};

const initialState: drawerState = {
    isOpen: false
};

const drawerSlice = createSlice({
    name: "drawer",
    initialState,
    reducers: {
        open: (state) => {
            state.isOpen = true;
        },
        close: (state) => {
            state.isOpen = false;
        }
    }
});

export const { open, close } = drawerSlice.actions;

export default drawerSlice.reducer;