import { configureStore } from '@reduxjs/toolkit';
import rowsReducer from './certificateSlice';

export default configureStore({
    reducer: {
        rows: rowsReducer,
    },
});
