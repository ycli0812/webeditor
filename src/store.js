import { configureStore } from '@reduxjs/toolkit';
import circuitReducer from './pages/Editor/reducers/circuitReducer';
import editorEventReducer from './pages/Editor/reducers/editorEventReducer';

export const store = configureStore({
    reducer: {
        editor: editorEventReducer,
        circuit: circuitReducer
    }
});