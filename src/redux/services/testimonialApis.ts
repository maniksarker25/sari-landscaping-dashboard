import baseApis from "../baseApis";

export interface TestimonialItemApi {
  _id?: string;
  id?: string;
  name: string;
  roleOrLocation?: string;
  role?: string;
  quote: string;
  rating: number;
  image?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetTestimonialsQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
}

export interface GetTestimonialsResponse {
  success?: boolean;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: TestimonialItemApi[];
}

export interface GetSingleTestimonialResponse {
  success?: boolean;
  message?: string;
  data: TestimonialItemApi;
}

export const testimonialApi = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query<GetTestimonialsResponse, GetTestimonialsQueryParams | void>({
      query: (params) => ({
        url: "/testimonial/get-all",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["testimonial"] as const,
    }),
    getSingleTestimonial: builder.query<GetSingleTestimonialResponse, string>({
      query: (id) => ({
        url: `/testimonial/get-single/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "testimonial", id }],
    }),
    createTestimonial: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/testimonial/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["testimonial"] as const,
    }),
    updateTestimonial: builder.mutation<
      any,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/testimonial/update/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["testimonial"] as const,
    }),
    deleteTestimonial: builder.mutation<any, string>({
      query: (id) => ({
        url: `/testimonial/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["testimonial"] as const,
    }),
  }),
});

export const {
  useGetTestimonialsQuery,
  useGetSingleTestimonialQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialApi;

export default testimonialApi;
