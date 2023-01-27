import { createSlice } from '@reduxjs/toolkit';

const initState = {
    status: 'default',
    circuit: {},
    target: {
        id: 'fucking id',
        type: '',
        features: []
    },
    anchorPoint: { x: 0, y: 0 },
    selectedList: []
};

const slice = createSlice({
    name: 'editor',
    initialState: initState,
    reducers: {
        setTargetId: (state, action) => {
            console.log('action', action);
            state.target.id = action.payload;
        }
    }
});

export const { setTargetId } = slice.actions;
export default slice.reducer;