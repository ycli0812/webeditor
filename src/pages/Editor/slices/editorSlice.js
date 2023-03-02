import { createSlice } from '@reduxjs/toolkit';

// Utils
import { generateTypeId } from '../../../utils/IdGenerator';

const initState = {
    filename: '',
    source: '',
    status: 'default',
    circuit: {},
    /* target and anchorPoint */
    target: {
        id: '',
        x: 0,
        y: 0,
        type: '',
        pins: [],
        features: []
    },
    anchorPoint: null,
    /* will soon be replaced by draft */
    draft: null,
    zoom: 6,
    gridX: 100,
    gridY: 100,
    selectedList: [],
    modified: false,
    elementTemplates: []
};

const slice = createSlice({
    name: 'editor',
    initialState: initState,
    reducers: {
        initEditor: {
            reducer: (state, action) => {
                const { filename = '', source = '' } = action.payload;
                state = JSON.parse(JSON.stringify(initState));
                state.filename = filename;
                state.source = source;
                return state;
            },
            prepare: (filename, source) => {
                return {
                    payload: { filename, source }
                };
            }
        },

        setEditorStatus: {
            reducer: (state, action) => {
                const { status } = action.payload;
                state.status = status;
                return state;
            },
            prepare: (status) => {
                return {
                    payload: { status }
                };
            }
        },

        setAnchorPoint: {
            reducer: (state, action) => {
                const { point } = action.payload;
                state.anchorPoint = point;
                return state;
            },
            prepare: (point) => {
                return {
                    payload: { point }
                };
            }
        },

        setTragetElement: {
            reducer: (state, action) => {
                const { id, type, pins, features } = action.payload;
                if (id !== undefined) {
                    state.target.id = id;
                }
                if (type !== undefined) {
                    state.target.type = type;
                }
                if (pins !== undefined) {
                    state.target.pins = pins;
                }
                if (features !== undefined) {
                    state.target.features = features;
                }
                return state;
            },
            prepare: (data) => {
                return {
                    payload: { ...data }
                };
            }
        },

        selectElement: {
            reducer: (state, action) => {
                const { id } = action.payload;
                state.selectedList.push(id);
                return state;
            },
            prepare: (id) => {
                return {
                    payload: { id }
                };
            }
        },

        clearSelect: {
            reducer: (state) => {
                state.selectedList = [];
                return state;
            },
            prepare: () => {
                return {};
            }
        },

        setModified: {
            reducer: (state, action) => {
                state.modified = action.payload.modified;
                return state;
            },
            prepare: (modified) => {
                return {
                    payload: { modified }
                };
            }
        },

        setCircuit: {
            reducer: (state, action) => {
                const { circuit } = action.payload;
                state.circuit = circuit;
                return state;
            },
            prepare: (circuit) => {
                return {
                    payload: { circuit }
                };
            }
        },

        addElement: {
            reducer: (state, action) => {
                const { id, pos, type, pins, features } = action.payload;
                const { elementSet } = state.circuit;
                if (id in elementSet) {
                    console.error('addElement: Id %s has already in the circuit.', id);
                    return state;
                }
                elementSet[id] = {
                    ...pos,
                    type,
                    pins,
                    features
                }
                state.modified = true;
                return state;
            },
            prepare: (id, type, pos, pins, features) => {
                return {
                    payload: { id, type, pos, pins, features }
                };
            }
        },

        applyDraftElement: {
            reducer: (state, action) => {
                const id = generateTypeId(state.target.type, state.circuit.elementSet);
                state.circuit.elementSet[id] = state.target;
                return state;
            },
            prepare: () => {
                return {
                    payload: {}
                };
            }
        },

        setDraftInfo: {
            reducer: (state, action) => {
                const { data } = action.payload;
                const { x = null, y = null, pins = null, features = null } = data;
                let { target } = state;
                if (x !== null) target.x = x;
                if (y !== null) target.y = y;
                if (pins !== null) {
                    for (let i in pins) {
                        for (let j in target.pins) {
                            if (target.pins[j].name === pins[i].name) {
                                target.pins[j].x = pins[i].x;
                                target.pins[j].y = pins[i].y;
                            }
                        }
                    }
                }
                if (features !== null) {
                    for (let i in features) {
                        for (let j in target.features) {
                            if (target.features[j].name === features[i].name) {
                                target.features[j].value = features[i].value;
                                if (target.features[j].unit !== undefined && features[i].unit !== undefined) {
                                    target.features[j].unit = features[i].unit;
                                }
                            }
                        }
                    }
                }
                return state;
            },
            prepare: (data) => {
                return {
                    payload: { data }
                };
            }
        },

        setElementInfo: {
            reducer: (state, action) => {
                const { id, x, y, type, pins, features } = action.payload;
                const { elementSet } = state.circuit;
                if (id === undefined || !id in elementSet) {
                    console.error('setElementInfo: A valid id must be given. Received:', id);
                    return state;
                }
                if (x !== undefined) {
                    elementSet[id].x = x;
                }
                if (y !== undefined) {
                    elementSet[id].y = y;
                }
                if (type !== undefined) {
                    elementSet[id].type = type;
                }
                if (pins !== undefined) {
                    elementSet[id].pins = pins;
                }
                if (features !== undefined) {
                    elementSet[id].features = features;
                }
                state.modified = true;
                return state;
            },
            prepare: (data) => {
                return {
                    payload: { ...data }
                };
            }
        },

        moveElement: {
            reducer: (state, action) => {
                const { id, newGridX, newGridY } = action.payload;
                const target = state.circuit.elementSet[id];
                const deltaX = newGridX - target.x;
                const deltaY = newGridY - target.y;
                target.x = newGridX;
                target.y = newGridY;
                for (let i in target.pins) {
                    target.pins[i].x += deltaX;
                    target.pins[i].y += deltaY;
                }
                state.modified = true;
                return state;
            },
            prepare: (id, newGridX, newGridY) => {
                return {
                    payload: { id, newGridX, newGridY }
                };
            }
        },

        setElementFeature: {
            reducer: (state, action) => {
                const { id, name, value, unit } = action.payload;
                const { elementSet } = state.circuit;
                if (id === undefined || !(id in elementSet)) {
                    console.error('setElementFeature: A valid id must be given. Received:', id);
                    return state;
                }
                const { features } = elementSet[id];
                if (name === undefined) {
                    console.error('setElementFeature: A valid feature name must be given. Received:', id);
                    return state;
                }
                for (let i in features) {
                    if (features[i].name == name) {
                        if (value !== undefined) {
                            features[i].value = value;
                        }
                        if (unit !== undefined) {
                            features[i].unit = unit;
                        }
                        return state;
                    }
                }
                features.push({ name, value, unit });
                state.modified = true;
                return state;
            },
            prepare: (data) => {
                return {
                    payload: { ...data }
                }
            }
        },

        removeElement: {
            reducer: (state, action) => {
                const { id } = action.payload;
                console.log(id);
                const { elementSet } = state.circuit;
                if (!(id in elementSet)) {
                    console.error('removeElement: Can not find element %s.', String(id));
                    return state;
                }
                delete elementSet[id];
                state.modified = true;
                return state;
            },
            prepare: (id) => {
                return {
                    payload: { id }
                };
            }
        },

        changeElementId: {
            reducer: (state, action) => {
                return state;
            },
            prepare: (originId, newId) => {
                return {
                    payload: { originId, newId }
                };
            }
        },

        setElementTemplates: {
            reducer: (state, action) => {
                const { templates } = action.payload;
                state.elementTemplates = templates;
                return state;
            },
            prepare: (templates) => {
                return {
                    payload: { templates }
                };
            }
        },

        zoomIn: {
            reducer: (state, action) => {
                const curZoom = state.zoom;
                state.zoom += curZoom >= 20 ? 0 : 1;
                return state;
            },
            prepare: () => {
                return {
                    payload: {}
                };
            }
        },

        zoomOut: {
            reducer: (state, action) => {
                const curZoom = state.zoom;
                state.zoom -= curZoom <= 4 ? 0 : 1;
                return state;
            },
            prepare: () => {
                return {
                    payload: {}
                };
            }
        },

        setGridCenter: {
            reducer: (state, action) => {
                const { x, y } = action.payload;
                state.gridX = x;
                state.gridY = y;
                return state;
            },
            prepare: (x, y) => {
                return {
                    payload: { x, y }
                };
            }
        }
    }
});

export const {
    initEditor,
    setEditorStatus,
    setAnchorPoint,
    setTragetElement,
    selectElement,
    clearSelect,
    setModified,
    setCircuit,
    addElement,
    applyDraftElement,
    setElementInfo,
    setElementFeature,
    removeElement,
    changeElementId,
    setElementTemplates,
    zoomIn,
    zoomOut,
    setGridCenter,
    setDraftInfo,
    moveElement
} = slice.actions;

export default slice.reducer;