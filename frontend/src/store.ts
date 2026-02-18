import { configureStore } from "@reduxjs/toolkit";
import { messageApi } from "./services/mesage.service";
import { userApi } from "./services/user.service";
import authReducer from  "./features/authSlice"
import { authApi } from "./services/auth.service";

export const store = configureStore({
    reducer: {
         auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [messageApi.reducerPath]: messageApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, messageApi.middleware, userApi.middleware)
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;