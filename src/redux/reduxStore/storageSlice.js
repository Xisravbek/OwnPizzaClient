import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    menuId: null,
    isRefresh: false
}

const storageSlice = createSlice({
    name: "storageSlice",
    initialState,
    reducers: {
        setMenuStorage: (state , {payload} ) => {
            state.menuId = payload;
        },
        startRefresh: (state ) => {
            state.isRefresh = true
        },
        stopRefresh: (state ) => {
            state.isRefresh = false
        }
    }

})

export const {setMenuStorage , startRefresh ,stopRefresh } = storageSlice.actions;
export default storageSlice.reducer;