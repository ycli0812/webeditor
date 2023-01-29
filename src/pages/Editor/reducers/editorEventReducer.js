import { createSlice } from '@reduxjs/toolkit';

const initState = {
    status: 'default',
    target: {
        id: 'no_id',
        type: '',
        features: []
    },
    anchorPoint: { x: 0, y: 0 },
    selectedList: [],
    modified: false
};

const slice = createSlice({
    name: 'editor',
    initialState: initState,
    reducers: {
        setEditorStatus: (state, action) => {
            const { status } = action.payload;
            state.status = status;
            return state;
        },

        setAnchorPoint: (state, action) => {
            const pos = action;
            state.anchorPoint = pos;
            return state;
        },

        setTragetElement: (state, action) => {
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

        selectElement: (state, action) => {
            const { id } = action.payload;
            state.selectedList.push(id);
            return state;
        },

        clearSelect: (state) => {
            state.selectedList = [];
            return state;
        },

        setModified: (state, action) => {
            state.modified = action.payload.modified;
            return state;
        }
    }
});

// export const { setTargetId } = slice.actions;
export default slice.reducer;