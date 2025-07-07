import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const websiteSettingsApi = createApi({
  reducerPath: "websiteSettingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getMoments: builder.query({
      query: () => ({
        url: `settings/moments?t=${Date.now()}`,
        method: "GET",
      }),
    }),
    googleReviews: builder.query({
      query: () => ({
        url: "places",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMomentsQuery, useGoogleReviewsQuery } = websiteSettingsApi;
