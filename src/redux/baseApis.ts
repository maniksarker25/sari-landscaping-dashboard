import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

const baseApis = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.dreamfloor.ae/api/v1",
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
    "gallery",
    "legal-info",
    "contact",
    "Service",
    "testimonial",
    "about-us",
    "contact-us",
    "faq",
    "partner",
    "privacy-policy",
    "slider",
    "terms-conditions",
  ],
  endpoints: () => ({}),
});

export default baseApis;
