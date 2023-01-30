import { createSlice } from '@reduxjs/toolkit';

const initState = {
    status: 'default',
    circuit: {},
    target: {
        id: '',
        type: '',
        features: []
    },
    anchorPoint: null,
    selectedList: [],
    modified: false,
    elementTemplates: []
};

const slice = createSlice({
    name: 'editor',
    initialState: initState,
    reducers: {
        initEditor: {
            reducer: (state) => {
                state = initState;
                return state;
            },
            prepare: () => {
                return {};
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
                const { id, type, features } = action.payload;
                if (id !== undefined) {
                    state.target.id = id;
                }
                else {
                    return state;
                }
                if (type !== undefined) {
                    state.target.type = type;
                } else {
                    state.target.type = '';
                }
                if (features !== undefined) {
                    state.target.features = features;
                } else {
                    state.target.features = [];
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
                const { id, pos, type, features } = action.payload;
                const { elementSet } = state.circuit;
                if (id in elementSet) {
                    console.error('addElement: Id %s has already in the circuit.', id);
                    return state;
                }
                elementSet[id] = {
                    ...pos,
                    type,
                    features
                }
                state.modified = true;
                return state;
            },
            prepare: (id, type, pos, features) => {
                return {
                    payload: { id, type, pos, features }
                };
            }
        },

        addDraftElement: {
            reducer: (state, action) => {
                // const { x, y } = action.payload;
                // const { target } = state.editor;
                // console.log(target);
                // state.modified = true;
                return state;
            },
            prepare: (x, y) => {
                return {
                    payload: { x, y }
                };
            }
        },

        setElementInfo: {
            reducer: (state, action) => {
                const { id, pos, type, features } = action.payload;
                const { elementSet } = state.circuit;
                if (id === undefined || !id in elementSet) {
                    console.error('setElementInfo: A valid id must be given. Received:', id);
                    return state;
                }
                if (pos !== undefined) {
                    elementSet[id].x = pos.x;
                    elementSet[id].y = pos.y;
                }
                if (type !== undefined) {
                    elementSet[id].type = type;
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
    addDraftElement,
    setElementInfo,
    setElementFeature,
    removeElement,
    changeElementId,
    setElementTemplates
} = slice.actions;

export default slice.reducer;