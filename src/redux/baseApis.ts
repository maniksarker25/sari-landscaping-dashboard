import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

const baseApis = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.20.9:9050/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "PropertyManager",
    "ContentManager",
    "SupportManager",
    "Admin",
    "Client",
    "LifeStyle",
    "Legal",
    "ManageMarket",
    "ManageProject",
    "user",
    "Properties",
    "AllProperties",
    "AdminStats",
    "ContentStats",
    "PropertyManagerStats",
    "SupportManagerStats",
    "ManageWeb",
    "paymentProperty",
    "LegalAndCompany",
  ],
  endpoints: () => ({}),
});

export default baseApis;
