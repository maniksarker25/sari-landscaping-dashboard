import baseApis from "../baseApis";
import type { Service } from "@/types";

export interface GetServicesQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  category?: string;
  isPublished?: boolean;
}

export interface GetServicesResponse {
  success?: boolean;
  message?: string;
  data: Service[] | { services: Service[]; total?: number; page?: number; limit?: number };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
  };
}

export interface GetSingleServiceResponse {
  success?: boolean;
  message?: string;
  data: Service;
}

const servicesApi = baseApis.injectEndpoints({
  endpoints: (build) => ({
    getServices: build.query<GetServicesResponse, GetServicesQueryParams | void>({
      query: (params) => ({
        url: "/service/get-all",
        method: "GET",
        params: params || {},
      }),
      providesTags: (result) => {
        const listTag = { type: "Service" as const, id: "LIST" };
        if (!result || !result.data) return [listTag];
        const servicesList = Array.isArray(result.data) ? result.data : result.data.services || [];
        return [
          listTag,
          ...servicesList.map((svc) => ({
            type: "Service" as const,
            id: svc.id || svc._id,
          })),
        ];
      },
    }),

    getPublishedServices: build.query<GetServicesResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/service/get-published",
        method: "GET",
        params: params || {},
      }),
      providesTags: [{ type: "Service", id: "LIST_PUBLISHED" }],
    }),

    getSingleService: build.query<GetSingleServiceResponse, string>({
      query: (id) => ({
        url: `/service/get-single/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Service", id }],
    }),

    getServiceBySlug: build.query<GetSingleServiceResponse, string>({
      query: (slug) => ({
        url: `/service/get-by-slug/${slug}`,
        method: "GET",
      }),
      providesTags: (_result, _error, slug) => [{ type: "Service", id: slug }],
    }),

    createDraftService: build.mutation<any, FormData>({
      query: (formData) => ({
        url: "/service/create-draft",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),

    createPublishedService: build.mutation<any, FormData>({
      query: (formData) => ({
        url: "/service/create-published",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),

    updateService: build.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/service/update/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Service", id },
        { type: "Service", id: "LIST" },
      ],
    }),

    publishService: build.mutation<any, string>({
      query: (id) => ({
        url: `/service/publish/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Service", id },
        { type: "Service", id: "LIST" },
      ],
    }),

    saveDraftService: build.mutation<any, string>({
      query: (id) => ({
        url: `/service/save-draft/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Service", id },
        { type: "Service", id: "LIST" },
      ],
    }),

    deleteService: build.mutation<any, string>({
      query: (id) => ({
        url: `/service/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetPublishedServicesQuery,
  useGetSingleServiceQuery,
  useGetServiceBySlugQuery,
  useCreateDraftServiceMutation,
  useCreatePublishedServiceMutation,
  useUpdateServiceMutation,
  usePublishServiceMutation,
  useSaveDraftServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;

export const useServicesQuery = useGetServicesQuery;
export const useCreateServiceMutation = useCreatePublishedServiceMutation;

export default servicesApi;
