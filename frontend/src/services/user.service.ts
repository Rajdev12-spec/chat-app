import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQuery"

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getProfile: build.query<any, void>({
            query: () => `user/me`
        }),
        getAllUsers: build.query<any, void>({
            query: () => `user/all-users`
        })
    })
})

export const { useGetProfileQuery, useGetAllUsersQuery } = userApi

