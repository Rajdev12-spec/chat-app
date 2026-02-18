import {
    fetchBaseQuery,

} from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants/apiUrl";
import type { RootState } from "../store";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout, setCredentials } from "../features/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken

        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }

        return headers
    },
})

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {

    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {

        const refreshResult = await baseQuery(
            { url: '/auth/refresh', method: 'POST' },
            api,
            extraOptions
        )

        if (refreshResult.data) {
            api.dispatch(
                setCredentials(refreshResult.data as { accessToken: string })
            )
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logout())
        }
    }

    return result
}
