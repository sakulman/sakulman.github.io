import { configureStore } from "@reduxjs/toolkit";
import scrollReducer from "./scroll/scrollSlice.ts";
import drawerReducer from "./scroll/drawerSlice.ts";

export const store = configureStore({
    reducer: {
        scroll: scrollReducer,
        drawer: drawerReducer,
    },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;