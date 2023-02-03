import { createSlice } from '@reduxjs/toolkit';

const initState = {
    user: '',
    logined: false
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
        }
    }
});

export default slice.reducer;
export const {
    login
} = slice.actions;