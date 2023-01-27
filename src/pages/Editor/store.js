import { configureStore } from '@reduxjs/toolkit';
import editorReduce from './reducers';

export const store = configureStore({
    reducer: {
        editor: editorReduce
    }
});