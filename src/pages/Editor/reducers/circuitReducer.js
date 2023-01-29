import { createSlice } from '@reduxjs/toolkit';

const initState = {
    circuit: {}
};

const slice = createSlice({
    name: 'circuit',
    initialState: initState,
    reducers: {
        setCircuit: (state, action) => {
            const { circuit } = action.payload;
            state.circuit = circuit;
            return state;
        },

        addElement: (state, action) => {
            const {id, pos, type, features} = action.payload;
            const {elementSet} = state.circuit;
            if(id in elementSet) {
                console.error('addElement: Id %s has already in the circuit.', id);
                return state;
            }
            elementSet[id] = {
                ...pos,
                type,
                features
            }
            // console.log('add element:', action);
            return state;
        },

        addDraftElement: (state, action) => {
            const { x, y } = action.payload;
            const { target } = state.editor;
            console.log(target);
        },

        setElementInfo: (state, action) => {
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
            return state;
        },

        setElementFeature: (state, action) => {
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
            return state;
        },

        removeElement: (state, action) => {
            const { id } = action.payload;
            console.log(id);
            const { elementSet } = state.circuit;
            if(!(id in elementSet)) {
                console.error('removeElement: Can not find element %s.', String(id));
                return state;
            }
            delete elementSet[id];
            return state;
        },

        changeElementId: (state, action) => { }
    }
});

// export const { addElement } = slice.actions;
export default slice.reducer;