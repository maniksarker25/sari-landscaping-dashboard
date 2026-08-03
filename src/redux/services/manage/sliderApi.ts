import baseApis from "../../baseApis";
import type { ApiResponse, SliderItemApi } from "./types";

export const sliderApi = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getSliders: builder.query<ApiResponse<SliderItemApi[]>, void>({
      query: () => ({
        url: "/manage/get-slider",
        method: "GET",
      }),
      providesTags: ["slider"],
    }),
    addSlider: builder.mutation<ApiResponse<SliderItemApi>, FormData>({
      query: (formData) => ({
        url: "/manage/add-slider",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["slider"],
    }),
    editSlider: builder.mutation<ApiResponse<SliderItemApi>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/manage/edit-slider/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["slider"],
    }),
    deleteSlider: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/manage/delete-slider/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["slider"],
    }),
  }),
});

export const {
  useGetSlidersQuery,
  useAddSliderMutation,
  useEditSliderMutation,
  useDeleteSliderMutation,
} = sliderApi;
