import baseApis from "../../baseApis";
import type { ApiResponse, CommonContentItem } from "./types";

export type { CommonContentItem };

export const privacyPolicyApi = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacyPolicy: builder.query<ApiResponse<CommonContentItem[] | CommonContentItem>, void>({
      query: () => ({
        url: "/manage/get-privacy-policy",
        method: "GET",
      }),
      providesTags: ["privacy-policy"],
    }),
    addPrivacyPolicy: builder.mutation<ApiResponse<CommonContentItem>, { title: string; content: string }>({
      query: (body) => ({
        url: "/manage/add-privacy-policy",
        method: "POST",
        body,
      }),
      invalidatesTags: ["privacy-policy"],
    }),
    editPrivacyPolicy: builder.mutation<
      ApiResponse<CommonContentItem>,
      { id: string; data: { title?: string; content?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/manage/edit-privacy-policy/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["privacy-policy"],
    }),
    deletePrivacyPolicy: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/manage/delete-privacy-policy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["privacy-policy"],
    }),
  }),
});

export const {
  useGetPrivacyPolicyQuery,
  useAddPrivacyPolicyMutation,
  useEditPrivacyPolicyMutation,
  useDeletePrivacyPolicyMutation,
} = privacyPolicyApi;
