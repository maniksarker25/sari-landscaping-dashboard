import baseApis from "../baseApis";

export const authApi = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    uploadGallery: builder.mutation({
      query: (credentials) => ({
        url: "/gallery/create",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["gallery"] as const,
    }),
  }),
});

export const { useUploadGalleryMutation } = authApi;
