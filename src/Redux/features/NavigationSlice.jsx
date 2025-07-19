import { createSlice } from '@reduxjs/toolkit';


export const navigationSlice = createSlice({
    name: 'navigation',
    initialState: {
        active: 'Dashboard', // Set 'Dashboard' as the default active link
    },
    reducers: {
        setActive: (state, action) => {
            state.active = action.payload;
        },
    },
});

export const { setActive } = navigationSlice.actions;

export default navigationSlice.reducer;