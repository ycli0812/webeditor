import { createSlice } from '@reduxjs/toolkit';

const initState = {
    user: '',
    logined: false,
    indexedDbHandler: null
};

const slice = createSlice({
    name: 'global',
    initialState: initState,
    reducers: {
        login: {
            reducer: (state, action) => {
                const { result } = action.payload;
                state.logined = result;
                return state;
            },
            prepare: (result) => {
                return {
                    payload: { result }
                };
            }
        },
        initIndexDb: {
            reducer: (state, action) => {
                state.indexedDbHandler = action.payload.handler;
                return state;
            },
            prepare: (handler) => {
                return {
                    payload: { handler }
                };
            }
        }
    }
});

export default slice.reducer;
export const {
    login,
    initIndexDb
} = slice.actions;