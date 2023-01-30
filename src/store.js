import { configureStore } from '@reduxjs/toolkit';
// import circuitReducer from './pages/Editor/reducers/circuitReducer';
import editorSlice from './pages/Editor/slices/editorSlice';

export const store = configureStore({
    reducer: {
        editor: editorSlice
        // circuit: circuitReducer
    }
});