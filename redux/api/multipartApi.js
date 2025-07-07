import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const multipartApi = createApi({
  reducerPath: "multipartApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/multipart" }),
  endpoints: (builder) => ({
    initiateMultipartUpload: builder.mutation({
      query: (formData) => ({
        url: "/initiate",
        method: "POST",
        body: formData,
      }),
    }),
    completeMultipartUpload: builder.mutation({
      query: (formData) => ({
        url: "/complete",
        method: "POST",
        body: formData,
      }),
    }),
    abortMultipartUpload: builder.mutation({
      query: (formData) => ({
        url: "/abort",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useInitiateMultipartUploadMutation,
  useCompleteMultipartUploadMutation,
  useAbortMultipartUploadMutation,
} = multipartApi;
