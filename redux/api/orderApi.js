import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    createNewOrder: builder.mutation({
      query(body) {
        return {
          url: "/orders/createOrder",
          method: "POST",
          body,
        };
      },
    }),
    myOrders: builder.query({
      query: () => `/orders/getOrdersByUser`,
    }),
    orderDetails: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ["Order"],
    }),
    stripeCheckoutSession: builder.mutation({
      query(body) {
        return {
          url: "/payment/checkout_session",
          method: "POST",
          body,
        };
      },
    }),
    getAdminOrders: builder.query({
      query: () => `/admin/orders`,
      providesTags: ["AdminOrders"],
    }),
    updateOrder: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/orders/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation({
      query(id) {
        return {
          url: `/admin/orders/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AdminOrders"],
    }),
    createCoupon: builder.mutation({
      query(body) {
        return {
          url: "/admin/coupon/new",
          method: "POST",
          body,
        };
      },
      invalidatesTags:["Coupons"]
    }),
    getCoupons: builder.query({
      query: () => "/admin/coupons",
      providesTags: ["Coupons"],
    }),
    updateCoupon: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/coupon/update/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Coupons"],
    }),
    deleteCoupon: builder.mutation({
      query(id) {
        return {
          url: `/admin/coupon/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Coupons"],
    }),
    checkCoupon: builder.mutation({
      query(body) {
        return {
          url: "/coupon/check",
          method: "POST",
          body,
        };
      },
      invalidatesTags:["Coupons"]
    }),
    applyCoupon: builder.mutation({
      query(body) {
        return {
          url: "/coupon/apply",
          method: "POST",
          body,
        };
      },
      invalidatesTags:["Coupons"]
    }),
  }),
});

export const {
  useCreateNewOrderMutation,
  useStripeCheckoutSessionMutation,
  useMyOrdersQuery,
  useOrderDetailsQuery,
  useGetAdminOrdersQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
  useCreateCouponMutation,
  useGetCouponsQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useCheckCouponMutation,
  useApplyCouponMutation
} = orderApi;
