import baseApis from "../../baseApis";
import type { ApiResponse, CommonContentItem } from "./types";

export const contactUsApi = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getContactUs: builder.query<ApiResponse<CommonContentItem[] | CommonContentItem>, void>({
      query: () => ({
        url: "/manage/get-contact-us",
        method: "GET",
      }),
      providesTags: ["contact-us"],
    }),
    addContactUs: builder.mutation<ApiResponse<CommonContentItem>, { title: string; content: string }>({
      query: (body) => ({
        url: "/manage/add-contact-us",
        method: "POST",
        body,
      }),
      invalidatesTags: ["contact-us"],
    }),
    editContactUs: builder.mutation<
      ApiResponse<CommonContentItem>,
      { id: string; data: { title?: string; content?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/manage/edit-contact-us/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["contact-us"],
    }),
    deleteContactUs: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/manage/delete-contact-us/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contact-us"],
    }),
  }),
});

export const {
  useGetContactUsQuery,
  useAddContactUsMutation,
  useEditContactUsMutation,
  useDeleteContactUsMutation,
} = contactUsApi;
