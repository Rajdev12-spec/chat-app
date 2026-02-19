import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQuery"

export const conversationApi = createApi({
    reducerPath: "conversationApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getConversation: build.query<any, string>({
            query: (conversationId) => `/conversation/${conversationId}`
        }),
        createConversation: build.mutation<any, string>({
            query: (receiverId) => ({
                url: `/conversation/create`,
                method: "POST",
                body: {receiverId}
            })

        }),
    })
})

export const { useCreateConversationMutation, useGetConversationQuery } = conversationApi

