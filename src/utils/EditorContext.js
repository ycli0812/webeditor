import { createContext, useContext } from 'react';
import circuitModel from './CircuitModel';

const validStatus = ['default', 'wiring', 'draggingComponent', 'deaggingCanvas', 'adding'];

const EditorContext = createContext({
    circuit: circuitModel,
    addElement: () => {},
    setElementFeature: () => {},
    setElementFeatureUnit: () => {},
    setElementPos: () => {},
    removeElement: () => {},
    addLine: () => {},
    removeLine: () => {},
    status: validStatus[0],
    toggleStatus: () => {},
    targetElementId: '',
    anchorPoint: {x: 0, y: 0},
    setAnchorPoint: () => {},
    selectedList: [],
    setSelectedList: () => {}
});

export { EditorContext };