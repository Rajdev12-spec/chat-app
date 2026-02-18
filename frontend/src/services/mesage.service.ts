import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../constants/apiUrl"

export const messageApi = createApi({
    reducerPath: "messageApi",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (build) => ({
        getMessage: build.query<any, string>({
            query: (conversationId) => `/message/${conversationId}`
        })
    })
})

export const { useGetMessageQuery } = messageApi

