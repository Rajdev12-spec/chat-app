import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQuery"
import type { SignInPayload, SignInResponse } from "../interfaces/auth.interface"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getRefreshToken: builder.query<any, void>({
      query: () => ({
        url: "/auth/refresh-token",
      })
    }),
    signIn: builder.mutation<SignInResponse, SignInPayload>({
      query: (body) => ({
        url: "/auth/sign-in",
        method: "POST",
        body,
      }),
    }),
    signUp: builder.mutation<SignInResponse, SignInPayload>({
      query: (body) => ({
        url: "/auth/sign-up",
        method: "POST",
        body,
      }),
    }),
    signOut: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/sign-out',
        method: "POST",
      })
    })

  }),
})

export const { useGetRefreshTokenQuery, useSignInMutation, useSignOutMutation, useSignUpMutation } = authApi
