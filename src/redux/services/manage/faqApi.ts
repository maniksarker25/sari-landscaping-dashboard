import baseApis from "../../baseApis";
import type { ApiResponse, FaqItemApi } from "./types";

export type { FaqItemApi };

export const faqApi = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<ApiResponse<FaqItemApi[]>, void>({
      query: () => ({
        url: "/manage/get-faq",
        method: "GET",
      }),
      providesTags: ["faq"],
    }),
    addFaq: builder.mutation<ApiResponse<FaqItemApi>, { question: string; answer: string }>({
      query: (body) => ({
        url: "/manage/add-faq",
        method: "POST",
        body,
      }),
      invalidatesTags: ["faq"],
    }),
    editFaq: builder.mutation<
      ApiResponse<FaqItemApi>,
      { id: string; data: { question?: string; answer?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/manage/edit-faq/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["faq"],
    }),
    deleteFaq: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/manage/delete-faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["faq"],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useAddFaqMutation,
  useEditFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
