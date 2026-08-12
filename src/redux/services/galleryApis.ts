import baseApis from "../baseApis";

export interface GalleryItemApi {
  _id: string;
  id?: string;
  location?: string;
  image: string;
  imageAlt: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface GetGalleryResponse {
  success?: boolean;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: GalleryItemApi[];
}

export interface GetGalleryQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  category?: string;
}

export const galleryApi = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getGallery: builder.query<GetGalleryResponse, GetGalleryQueryParams | void>(
      {
        query: (params) => ({
          url: "/gallery/get-all",
          method: "GET",
          params: params || {},
        }),
        providesTags: ["gallery"] as const,
      },
    ),
    uploadGallery: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/gallery/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["gallery"] as const,
    }),
    updateGallery: builder.mutation<
      any,
      { id: string; data: FormData | Record<string, any> }
    >({
      query: ({ id, data }) => ({
        url: `/gallery/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["gallery"] as const,
    }),
    deleteGallery: builder.mutation<any, string>({
      query: (id) => ({
        url: `/gallery/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["gallery"] as const,
    }),
  }),
});

export const {
  useGetGalleryQuery,
  useUploadGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
} = galleryApi;
