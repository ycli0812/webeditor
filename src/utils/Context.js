import { createContext, useContext } from 'react';
// import circuitModel from './CircuitModel';

const validStatus = ['default', 'wiring', 'draggingComponent', 'deaggingCanvas', 'adding'];

const EditorContext = createContext({
    circuit: {},
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
    setSelectedList: () => {},
    restoredElement: {},
    setRestoredElement: () => {}
});

const GlobalContext = createContext({
    modified: false,
    setModified: () => {}
});

export { EditorContext, GlobalContext };