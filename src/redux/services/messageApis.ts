import baseApis from "../baseApis";

export const CONTACT_STATUS = {
  New: "New",
  Read: "Read",
  Replied: "Replied",
  Archived: "Archived",
} as const;

export type ContactStatus = (typeof CONTACT_STATUS)[keyof typeof CONTACT_STATUS] | string;

export interface ContactRequestData {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  interestedCategory?: string;
  interestedService?: string;
  message: string;
  status?: ContactStatus;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateContactRequestPayload {
  name: string;
  email: string;
  phone?: string;
  interestedCategory?: string;
  interestedService?: string;
  message: string;
}

export interface UpdateContactStatusPayload {
  status: ContactStatus;
}

export interface UpdateContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  interestedCategory?: string;
  interestedService?: string;
  message?: string;
  status?: ContactStatus;
}

export interface GetContactsQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  status?: string;
}

export interface GetContactsResponse {
  success?: boolean;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
  };
  data: ContactRequestData[];
}

export interface GetSingleContactResponse {
  success?: boolean;
  message?: string;
  data: ContactRequestData;
}

export const messageApi = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation<any, CreateContactRequestPayload>({
      query: (body) => ({
        url: "/contact/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["contact"] as const,
    }),

    deleteContact: builder.mutation<any, string>({
      query: (id) => ({
        url: `/contact/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contact"] as const,
    }),

    getContacts: builder.query<GetContactsResponse, GetContactsQueryParams | void>({
      query: (params) => ({
        url: "/contact/get-all",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["contact"] as const,
    }),

    getSingleContact: builder.query<GetSingleContactResponse, string>({
      query: (id) => ({
        url: `/contact/get-single/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "contact", id }],
    }),

    updateContactStatus: builder.mutation<any, { id: string; status: ContactStatus }>({
      query: ({ id, status }) => ({
        url: `/contact/update-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["contact"] as const,
    }),

    updateContact: builder.mutation<any, { id: string; data: UpdateContactPayload }>({
      query: ({ id, data }) => ({
        url: `/contact/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["contact"] as const,
    }),
  }),
});

export const {
  useCreateContactMutation,
  useDeleteContactMutation,
  useGetContactsQuery,
  useGetSingleContactQuery,
  useUpdateContactStatusMutation,
  useUpdateContactMutation,
} = messageApi;

export default messageApi;
