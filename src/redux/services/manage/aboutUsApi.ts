import baseApis from "../../baseApis";
import type { ApiResponse, CommonContentItem } from "./types";

export const aboutUsApi = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAboutUs: builder.query<ApiResponse<CommonContentItem[] | CommonContentItem>, void>({
      query: () => ({
        url: "/manage/get-about-us",
        method: "GET",
      }),
      providesTags: ["about-us"],
    }),
    addAboutUs: builder.mutation<ApiResponse<CommonContentItem>, { title: string; content: string }>({
      query: (body) => ({
        url: "/manage/add-about-us",
        method: "POST",
        body,
      }),
      invalidatesTags: ["about-us"],
    }),
    editAboutUs: builder.mutation<
      ApiResponse<CommonContentItem>,
      { id: string; data: { title?: string; content?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/manage/edit-about-us/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["about-us"],
    }),
    deleteAboutUs: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/manage/delete-about-us/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["about-us"],
    }),
  }),
});

export const {
  useGetAboutUsQuery,
  useAddAboutUsMutation,
  useEditAboutUsMutation,
  useDeleteAboutUsMutation,
} = aboutUsApi;
