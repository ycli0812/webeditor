import { createContext, useContext } from 'react';

const validStatus = ['default', 'wiring', 'draggingComponent', 'deaggingCanvas', 'adding'];

const EditorContext = createContext({
    status: validStatus[0],
    toggleStatus: () => {},
    targetElementId: '',
    lastAnchorPoint: {x: 0, y: 0}
});

export { EditorContext };