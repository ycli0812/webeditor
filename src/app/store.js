import { configureStore } from '@reduxjs/toolkit';
import editorSlice from '../pages/Editor/slices/editorSlice';
import globalSlice from './globalSlice';

export const store = configureStore({
    reducer: {
        global: globalSlice,
        editor: editorSlice
    }
});