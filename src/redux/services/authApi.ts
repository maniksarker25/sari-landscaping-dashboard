import baseApis from "../baseApis";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    token?: string;
    user?: any;
  };
  accessToken?: string;
  token?: string;
  user?: any;
}

export interface ProfileResponse {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: any;
}

export const authApi = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["user"] as const,
    }),
    getMyProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "/User/get-my-profile",
        method: "GET",
      }),
      providesTags: ["user"] as const,
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMyProfileQuery,
  useLazyGetMyProfileQuery,
} = authApi;
