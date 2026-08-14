import baseApis from "../baseApis";

export interface CategoryChartItem {
  month: string;
  Pools?: number;
  Landscaping?: number;
  [category: string]: string | number | undefined;
}

export interface CategoryChartResponse {
  success: boolean;
  message: string;
  data: CategoryChartItem[];
}

export interface InquiryChartItem {
  month: string;
  inquiryCount: number;
}

export interface InquiryChartResponse {
  success: boolean;
  message: string;
  data: InquiryChartItem[];
}

export interface DashboardMetaData {
  totalServices: number;
  totalGallery: number;
  totalNewMessages: number;
  totalTestimonial: number;
}

export interface DashboardMetaResponse {
  success: boolean;
  message: string;
  data: DashboardMetaData;
}

export const metaApi = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryChart: builder.query<CategoryChartResponse, { year: number }>({
      query: (params: { year: number }) => ({
        url: "/meta/category-chart",
        method: "GET",
        params,
      }),
    }),

    getInquiryChart: builder.query<InquiryChartResponse, { year: number }>({
      query: (params: { year: number }) => ({
        url: "/meta/inquiry-chart",
        method: "GET",
        params,
      }),
    }),
    getMetaData: builder.query<DashboardMetaResponse, void>({
      query: () => ({
        url: "/meta/meta-data",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCategoryChartQuery,
  useGetInquiryChartQuery,
  useGetMetaDataQuery,
} = metaApi;

