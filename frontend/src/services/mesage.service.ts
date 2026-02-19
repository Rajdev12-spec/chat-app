import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQuery"

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    getMessage: build.query<any, string>({
      query: (conversationId) => `/message/${conversationId}`,
    }),

    sendMessage: build.mutation<
      any,
      { conversationId: string; text: string }
    >({
      query: ({ conversationId, text }) => ({
        url: `/message/send-message`,
        method: "POST",
        body: { conversationId, text },
      }),
    }),
  }),
})

export const {
  useGetMessageQuery,
  useSendMessageMutation,
} = messageApi
