import baseApis from "../../baseApis";
import type { ApiResponse, CommonContentItem } from "./types";

export const termsConditionsApi = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getTermsConditions: builder.query<ApiResponse<CommonContentItem[] | CommonContentItem>, void>({
      query: () => ({
        url: "/manage/get-terms-conditions",
        method: "GET",
      }),
      providesTags: ["terms-conditions"],
    }),
    addTermsConditions: builder.mutation<ApiResponse<CommonContentItem>, { title: string; content: string }>({
      query: (body) => ({
        url: "/manage/add-terms-conditions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["terms-conditions"],
    }),
    editTermsConditions: builder.mutation<
      ApiResponse<CommonContentItem>,
      { id: string; data: { title?: string; content?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/manage/edit-terms-conditions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["terms-conditions"],
    }),
    deleteTermsConditions: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/manage/delete-terms-conditions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["terms-conditions"],
    }),
  }),
});

export const {
  useGetTermsConditionsQuery,
  useAddTermsConditionsMutation,
  useEditTermsConditionsMutation,
  useDeleteTermsConditionsMutation,
} = termsConditionsApi;
