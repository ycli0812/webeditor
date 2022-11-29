import { createContext, useContext } from 'react';
import circuitModel from './CircuitModel';

const validStatus = ['default', 'wiring', 'draggingComponent', 'deaggingCanvas', 'adding'];

const EditorContext = createContext({
    circuit: circuitModel,
    status: validStatus[0],
    toggleStatus: () => {},
    targetElementId: '',
    lastAnchorPoint: {x: 0, y: 0}
});

export { EditorContext };