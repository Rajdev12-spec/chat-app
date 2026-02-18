import { createSlice } from "@reduxjs/toolkit"

interface AuthState {
    accessToken: string | null
    isAuthChecked: boolean
}

const initialState: AuthState = {
    accessToken: null,
    isAuthChecked: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.accessToken = action.payload.accessToken
            state.isAuthChecked = true
        },
        logout: (state) => {
            state.accessToken = null
            state.isAuthChecked = true
        },
        setAuthChecked: (state) => {
            state.isAuthChecked = true
        }
    },
})

export const { setCredentials, logout, setAuthChecked } = authSlice.actions
export default authSlice.reducer
