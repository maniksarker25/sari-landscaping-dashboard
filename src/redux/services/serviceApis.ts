import baseApis from "../baseApis";

const servicesApi = baseApis.injectEndpoints({
  endpoints: (build) => ({
    services: build.query({
      query: () => ({
        url: "/service/get-all",
        method: "GET",
      }),
    }),
    createService: build.mutation({
      query: (data) => ({
        url: "/service/create-published",
        method: "POST",
        body: data,
      }),
    }),
    createDraftService: build.mutation({
      query: (data) => ({
        url: "/service/create-draft",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useServicesQuery,
  useCreateServiceMutation,
  useCreateDraftServiceMutation,
} = servicesApi;
export default servicesApi;
