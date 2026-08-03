import baseApis from "../../baseApis";
import type { ApiResponse, PartnerItemApi } from "./types";

export const partnerApi = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getPartners: builder.query<ApiResponse<PartnerItemApi[]>, void>({
      query: () => ({
        url: "/manage/get-partner",
        method: "GET",
      }),
      providesTags: ["partner"],
    }),
    addPartner: builder.mutation<ApiResponse<PartnerItemApi>, { name: string; link: string }>({
      query: (body) => ({
        url: "/manage/add-partner",
        method: "POST",
        body,
      }),
      invalidatesTags: ["partner"],
    }),
    editPartner: builder.mutation<
      ApiResponse<PartnerItemApi>,
      { id: string; data: { name?: string; link?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/manage/edit-partner/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["partner"],
    }),
    deletePartner: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/manage/delete-partner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["partner"],
    }),
  }),
});

export const {
  useGetPartnersQuery,
  useAddPartnerMutation,
  useEditPartnerMutation,
  useDeletePartnerMutation,
} = partnerApi;
