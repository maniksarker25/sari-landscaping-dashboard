import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
//
const baseApis = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "https://57n8wl91-5000.inc1.devtunnels.ms/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "user",
    "Service",
    "gallery",
    "about-us",
    "contact-us",
    "faq",
    "partner",
    "privacy-policy",
    "slider",
    "terms-conditions",
    "testimonial",
    "contact",
    "legal-info",
  ],
  endpoints: () => ({}),
});

export default baseApis;
