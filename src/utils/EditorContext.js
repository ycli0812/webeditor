import { createContext, useContext } from 'react';

const validStatus = ['default', 'wiring', 'draggingComponent', 'deaggingCanvas', 'adding'];

const EditorContext = createContext({
    status: validStatus[0],
    toggleStatus: () => {},
    targetElementId: ''
});

export { EditorContext };